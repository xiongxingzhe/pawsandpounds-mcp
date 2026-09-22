/**
 * Paws & Pounds — Calorie Calculation Engine (web)
 *
 * Pure functions, no side effects. Ported from the App's
 * `src/engine/calorieEngine.ts` + `src/constants/activityFactors.ts`.
 * Self-contained — do NOT import from the App project (tech stacks differ).
 *
 * Formula reference:
 *   RER (kcal/day) = 70 × weight_kg^0.75
 *   DER (kcal/day) = RER × maintenance_factor
 *
 * Sources consulted:
 *   - WSAVA Global Nutrition Toolkit (2021) — energy calculation section
 *   - AAHA Weight Management Guidelines for Dogs and Cats (2014)
 *   - NRC "Nutrient Requirements of Dogs and Cats" (2006)
 */

// ── Types ─────────────────────────────────────────────────────

export type Species = 'cat' | 'dog';
export type ActivityLevel = 'indoor' | 'low' | 'moderate' | 'high';
export type GoalDirection = 'lose' | 'gain' | 'maintain';

export interface CalorieInput {
  /** Current body weight in kilograms */
  weightKg: number;
  /** Target body weight in kilograms (same as weightKg to maintain) */
  targetWeightKg: number;
  species: Species;
  neutered: boolean;
  activityLevel: ActivityLevel;
  /** Kcal per 100 g of the pet's food. Leave undefined to skip grams output. */
  foodKcalPer100g?: number;
}

export interface CaloriePlanResult {
  /** Resting Energy Requirement (kcal/day), rounded */
  rer: number;
  /** Daily Energy Requirement at maintenance (kcal/day), rounded */
  der: number;
  /** Adjusted daily kcal budget for the chosen weight goal, rounded */
  dailyKcalBudget: number;
  /** 90% of the budget allocated to main meals, rounded */
  mainFoodKcal: number;
  /** 10% of the budget allocated to treats, rounded */
  treatAllowanceKcal: number;
  /** Grams of main food per day; null if `foodKcalPer100g` not provided */
  foodGrams: number | null;
  /** Max safe weekly loss as fraction (0.02 cat, 0.03 dog) */
  safeWeeklyLossRate: number;
  /** Max safe weekly loss in kg (2 decimals) */
  safeWeeklyLossKg: number;
  /** Estimated weeks to reach target (0 if at goal) */
  estimatedWeeksToGoal: number;
  goalDirection: GoalDirection;
  /** The maintenance / weight-goal factor actually used */
  activityFactor: number;
}

// ── Constants ─────────────────────────────────────────────────

export const ACTIVITY_FACTORS = {
  cat: {
    weight_loss: 0.8,
    neutered_indoor: 1.2,
    intact_active: 1.4,
  },
  dog: {
    weight_loss: 1.0,
    neutered_low: 1.2,
    neutered_moderate: 1.4,
    intact_active: 1.6,
  },
  weight_gain_multiplier: 1.2,
} as const;

const KCAL_TOLERANCE_KG = 0.05; // 50 g goal-direction tolerance
const TREAT_FRACTION = 0.1; // 10% of budget
const KG_PER_LB = 0.453592;

// ── Unit Conversion Helpers ───────────────────────────────────

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

// ── Core Formulas ─────────────────────────────────────────────

/** Resting Energy Requirement: RER = 70 × weight_kg^0.75 */
export function calculateRER(weightKg: number): number {
  if (!Number.isFinite(weightKg) || weightKg <= 0) return 0;
  return 70 * Math.pow(weightKg, 0.75);
}

/**
 * Resolve the maintenance activity factor based on species, neutered status,
 * and activity level. Mirrors the App engine's rules.
 */
export function getMaintenanceFactor(
  species: Species,
  neutered: boolean,
  activityLevel: ActivityLevel,
): number {
  if (species === 'cat') {
    if (!neutered && activityLevel === 'high') {
      return ACTIVITY_FACTORS.cat.intact_active;
    }
    return ACTIVITY_FACTORS.cat.neutered_indoor;
  }

  // Dog
  if (!neutered && (activityLevel === 'high' || activityLevel === 'moderate')) {
    return ACTIVITY_FACTORS.dog.intact_active;
  }
  if (activityLevel === 'moderate') {
    return ACTIVITY_FACTORS.dog.neutered_moderate;
  }
  // indoor or low
  return ACTIVITY_FACTORS.dog.neutered_low;
}

/** Species-specific weight-loss multiplier (cat 0.8, dog 1.0) */
export function getWeightLossFactor(species: Species): number {
  return species === 'cat'
    ? ACTIVITY_FACTORS.cat.weight_loss
    : ACTIVITY_FACTORS.dog.weight_loss;
}

/** Max safe weekly weight loss rate as fraction of body weight (cat 2%, dog 3%) */
export function getSafeWeeklyRate(species: Species): number {
  return species === 'cat' ? 0.02 : 0.03;
}

// ── Main Calculator ───────────────────────────────────────────

export function calculateCaloriePlan(input: CalorieInput): CaloriePlanResult {
  const {
    weightKg,
    targetWeightKg,
    species,
    neutered,
    activityLevel,
    foodKcalPer100g,
  } = input;

  const rer = calculateRER(weightKg);
  const maintenanceFactor = getMaintenanceFactor(species, neutered, activityLevel);
  const der = rer * maintenanceFactor;

  // Determine goal direction (50 g tolerance)
  let goalDirection: GoalDirection;
  if (targetWeightKg < weightKg - KCAL_TOLERANCE_KG) {
    goalDirection = 'lose';
  } else if (targetWeightKg > weightKg + KCAL_TOLERANCE_KG) {
    goalDirection = 'gain';
  } else {
    goalDirection = 'maintain';
  }

  // Daily kcal budget based on goal
  let dailyKcalBudget: number;
  let activityFactor: number;

  if (goalDirection === 'lose') {
    activityFactor = getWeightLossFactor(species);
    dailyKcalBudget = rer * activityFactor;
  } else if (goalDirection === 'gain') {
    activityFactor = maintenanceFactor * ACTIVITY_FACTORS.weight_gain_multiplier;
    dailyKcalBudget = rer * activityFactor;
  } else {
    activityFactor = maintenanceFactor;
    dailyKcalBudget = der;
  }

  // 90/10 split: main food vs treats
  const treatAllowanceKcal = Math.round(dailyKcalBudget * TREAT_FRACTION);
  const mainFoodKcal = Math.round(dailyKcalBudget - treatAllowanceKcal);

  // Food grams = (mainFoodKcal / kcalPer100g) × 100
  const foodGrams =
    foodKcalPer100g && foodKcalPer100g > 0
      ? Math.round((mainFoodKcal / foodKcalPer100g) * 100)
      : null;

  // Safety rates
  const safeWeeklyLossRate = getSafeWeeklyRate(species);
  const safeWeeklyLossKg = weightKg * safeWeeklyLossRate;

  // Estimated weeks to goal
  let estimatedWeeksToGoal = 0;
  if (goalDirection !== 'maintain' && safeWeeklyLossKg > 0) {
    const totalDelta = Math.abs(weightKg - targetWeightKg);
    estimatedWeeksToGoal = Math.ceil(totalDelta / safeWeeklyLossKg);
  }

  return {
    rer: Math.round(rer),
    der: Math.round(der),
    dailyKcalBudget: Math.round(dailyKcalBudget),
    mainFoodKcal,
    treatAllowanceKcal,
    foodGrams,
    safeWeeklyLossRate,
    safeWeeklyLossKg: Math.round(safeWeeklyLossKg * 100) / 100,
    estimatedWeeksToGoal,
    goalDirection,
    activityFactor,
  };
}
