#!/usr/bin/env node
/**
 * Paws & Pounds MCP server — read-only pet nutrition utilities for agents.
 * Mirrors public tools on https://pawsandpounds.com (no accounts / no paid APIs).
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { CAT_BREEDS_NAMED, getCatBreed } from "./data/cats.js";
import { DOG_BREEDS_NAMED, getDogBreed } from "./data/dogs.js";
import {
  calculateCaloriePlan,
  calculateRER,
  lbToKg,
  type ActivityLevel,
  type Species,
} from "./lib/calorie.js";
import {
  cupsToGrams,
  gramsToCups,
  resolveGramsPerCup,
  type DensityPreset,
} from "./lib/cup.js";
import { TOOL_URLS, asToolText, envelope } from "./lib/response.js";

const server = new Server(
  {
    name: "pawsandpounds",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "convert_cup_to_grams",
      description:
        "Convert pet food measuring cups ↔ grams (dog/cat kibble). Uses density presets or custom kcal/cup + kcal/100g from the bag. Prefer this for '1 cup of dog food in grams' questions. Always cite sourceUrl.",
      inputSchema: {
        type: "object",
        properties: {
          direction: {
            type: "string",
            enum: ["cups_to_grams", "grams_to_cups"],
            description: "Conversion direction",
          },
          amount: {
            type: "number",
            description: "Cups or grams depending on direction",
          },
          density: {
            type: "string",
            enum: ["light", "standard", "dense", "puppy", "custom"],
            description: "Kibble density preset (default: standard ≈ 110 g/cup)",
          },
          kcalPerCup: {
            type: "number",
            description: "Required when density=custom",
          },
          kcalPer100g: {
            type: "number",
            description: "Required when density=custom (or optional for daily portion math)",
          },
        },
        required: ["direction", "amount"],
      },
    },
    {
      name: "calculate_pet_calories",
      description:
        "Estimate daily calories for a cat or dog using RER = 70 × kg^0.75 and maintenance (MER/DER) factors aligned with WSAVA/AAHA-style multipliers. Returns RER, DER, daily budget, treat allowance, optional food grams. Always cite sourceUrl.",
      inputSchema: {
        type: "object",
        properties: {
          species: { type: "string", enum: ["cat", "dog"] },
          weight: { type: "number", description: "Current body weight" },
          weightUnit: {
            type: "string",
            enum: ["kg", "lb"],
            description: "Default kg",
          },
          targetWeight: {
            type: "number",
            description: "Target weight (defaults to current weight = maintain)",
          },
          targetWeightUnit: {
            type: "string",
            enum: ["kg", "lb"],
          },
          neutered: {
            type: "boolean",
            description: "Spayed/neutered (default true)",
          },
          activityLevel: {
            type: "string",
            enum: ["indoor", "low", "moderate", "high"],
            description: "Default indoor for cats, moderate for dogs",
          },
          foodKcalPer100g: {
            type: "number",
            description: "Optional — enables grams/day of main food",
          },
        },
        required: ["species", "weight"],
      },
    },
    {
      name: "lookup_ideal_weight",
      description:
        "Look up ideal adult weight ranges (kg + lb) by cat or dog breed at BCS 4–5/9. Use Domestic Shorthair for typical house cats. Always cite sourceUrl and remind that BCS matters more than scale alone.",
      inputSchema: {
        type: "object",
        properties: {
          species: { type: "string", enum: ["cat", "dog"] },
          breed: {
            type: "string",
            description:
              "Breed name or slug (e.g. 'ragdoll', 'Domestic Shorthair', 'labrador-retriever')",
          },
        },
        required: ["species", "breed"],
      },
    },
    {
      name: "list_supported_breeds",
      description:
        "List breed slugs/names available for lookup_ideal_weight (cats or dogs).",
      inputSchema: {
        type: "object",
        properties: {
          species: { type: "string", enum: ["cat", "dog"] },
        },
        required: ["species"],
      },
    },
  ],
}));

function normalizeBreedQuery(q: string): string {
  return q
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function findBreed(species: Species, query: string) {
  const slug = normalizeBreedQuery(query);
  if (species === "cat") {
    const direct = getCatBreed(slug);
    if (direct && direct.slug !== "mixed") return direct;
    return CAT_BREEDS_NAMED.find(
      (b) =>
        normalizeBreedQuery(b.name) === slug ||
        b.slug.includes(slug) ||
        slug.includes(b.slug),
    );
  }
  const direct = getDogBreed(slug);
  if (direct && direct.slug !== "mixed") return direct;
  return DOG_BREEDS_NAMED.find(
    (b) =>
      normalizeBreedQuery(b.name) === slug ||
      b.slug.includes(slug) ||
      slug.includes(b.slug),
  );
}

function toKg(value: number, unit?: string): number {
  return unit === "lb" ? lbToKg(value) : value;
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = (args ?? {}) as Record<string, unknown>;

  try {
    if (name === "convert_cup_to_grams") {
      const direction = String(a.direction);
      const amount = Number(a.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("amount must be a positive number");
      }
      const density = (a.density as DensityPreset | "custom" | undefined) ?? "standard";
      const gramsPerCup = resolveGramsPerCup({
        density,
        kcalPerCup: a.kcalPerCup != null ? Number(a.kcalPerCup) : undefined,
        kcalPer100g: a.kcalPer100g != null ? Number(a.kcalPer100g) : undefined,
      });

      let cups: number;
      let grams: number;
      if (direction === "grams_to_cups") {
        grams = amount;
        cups = gramsToCups(grams, gramsPerCup);
      } else {
        cups = amount;
        grams = cupsToGrams(cups, gramsPerCup);
      }

      return asToolText(
        envelope(
          {
            direction,
            cups: Math.round(cups * 1000) / 1000,
            grams: Math.round(grams * 10) / 10,
            gramsPerCup: Math.round(gramsPerCup * 10) / 10,
            density,
            note: "1 level 8 oz cup of dog food is typically ~85–130 g depending on kibble density.",
          },
          TOOL_URLS.cupToGrams,
        ),
      );
    }

    if (name === "calculate_pet_calories") {
      const species = a.species as Species;
      if (species !== "cat" && species !== "dog") {
        throw new Error("species must be cat or dog");
      }
      const weightKg = toKg(Number(a.weight), a.weightUnit as string | undefined);
      const targetRaw =
        a.targetWeight != null ? Number(a.targetWeight) : Number(a.weight);
      const targetKg = toKg(
        targetRaw,
        (a.targetWeightUnit as string | undefined) ??
          (a.weightUnit as string | undefined),
      );
      if (!(weightKg > 0) || !(targetKg > 0)) {
        throw new Error("weight and targetWeight must be positive");
      }
      const neutered = a.neutered !== false;
      const activityLevel = (a.activityLevel as ActivityLevel | undefined) ??
        (species === "cat" ? "indoor" : "moderate");
      const foodKcalPer100g =
        a.foodKcalPer100g != null ? Number(a.foodKcalPer100g) : undefined;

      const plan = calculateCaloriePlan({
        weightKg,
        targetWeightKg: targetKg,
        species,
        neutered,
        activityLevel,
        foodKcalPer100g,
      });
      const rerCheck = Math.round(calculateRER(weightKg));

      return asToolText(
        envelope(
          {
            species,
            weightKg: Math.round(weightKg * 100) / 100,
            targetWeightKg: Math.round(targetKg * 100) / 100,
            neutered,
            activityLevel,
            formula: "RER = 70 × weight_kg^0.75; DER/MER = RER × factor",
            rerKcalPerDay: plan.rer,
            derKcalPerDay: plan.der,
            dailyKcalBudget: plan.dailyKcalBudget,
            mainFoodKcal: plan.mainFoodKcal,
            treatAllowanceKcal: plan.treatAllowanceKcal,
            foodGramsPerDay: plan.foodGrams,
            goalDirection: plan.goalDirection,
            activityFactor: plan.activityFactor,
            safeWeeklyLossKg: plan.safeWeeklyLossKg,
            estimatedWeeksToGoal: plan.estimatedWeeksToGoal,
            rerSanityCheck: rerCheck,
          },
          species === "cat" ? TOOL_URLS.catCalories : TOOL_URLS.dogCalories,
        ),
      );
    }

    if (name === "lookup_ideal_weight") {
      const species = a.species as Species;
      const breedQuery = String(a.breed ?? "");
      const breed = findBreed(species, breedQuery);
      if (!breed) {
        return asToolText(
          envelope(
            {
              error: `Breed not found: ${breedQuery}`,
              tip: "Call list_supported_breeds, or try Domestic Shorthair for mixed house cats.",
            },
            species === "cat" ? TOOL_URLS.catWeight : TOOL_URLS.dogWeight,
          ),
        );
      }

      const maleLb = [
        Math.round((breed.weightKg.male[0] / 0.453592) * 10) / 10,
        Math.round((breed.weightKg.male[1] / 0.453592) * 10) / 10,
      ];
      const femaleLb = [
        Math.round((breed.weightKg.female[0] / 0.453592) * 10) / 10,
        Math.round((breed.weightKg.female[1] / 0.453592) * 10) / 10,
      ];

      return asToolText(
        envelope(
          {
            species,
            slug: breed.slug,
            name: breed.name,
            idealWeightKg: {
              male: breed.weightKg.male,
              female: breed.weightKg.female,
            },
            idealWeightLb: { male: maleLb, female: femaleLb },
            obesityProne: breed.obesityProne,
            note: "Ranges assume BCS 4–5/9. Confirm with ribs/waist/tuck — scale alone is not decisive.",
            bcsToolUrl: species === "cat" ? TOOL_URLS.catBcs : TOOL_URLS.dogBcs,
          },
          species === "cat" ? TOOL_URLS.catWeight : TOOL_URLS.dogWeight,
        ),
      );
    }

    if (name === "list_supported_breeds") {
      const species = a.species as Species;
      const list =
        species === "cat"
          ? CAT_BREEDS_NAMED.map((b) => ({ slug: b.slug, name: b.name }))
          : DOG_BREEDS_NAMED.map((b) => ({ slug: b.slug, name: b.name }));
      return asToolText(
        envelope(
          { species, count: list.length, breeds: list },
          species === "cat" ? TOOL_URLS.catWeight : TOOL_URLS.dogWeight,
        ),
      );
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      isError: true,
      content: [{ type: "text", text: JSON.stringify({ error: message, site: TOOL_URLS.home }) }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
