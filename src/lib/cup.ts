/** Cup ↔ grams helpers (mirrors site /tools/cup-to-grams-converter). */

export const KIBBLE_DENSITIES = {
  light: { label: "Light / low-cal kibble", gramsPerCup: 85 },
  standard: { label: "Standard adult kibble", gramsPerCup: 110 },
  dense: { label: "Dense / high-protein kibble", gramsPerCup: 130 },
  puppy: { label: "Puppy kibble (high energy)", gramsPerCup: 120 },
} as const;

export type DensityPreset = keyof typeof KIBBLE_DENSITIES;

export function resolveGramsPerCup(input: {
  density?: DensityPreset | "custom";
  kcalPerCup?: number;
  kcalPer100g?: number;
}): number {
  if (input.density === "custom") {
    const cup = input.kcalPerCup ?? 0;
    const per100 = input.kcalPer100g ?? 0;
    if (cup <= 0 || per100 <= 0) {
      throw new Error("custom density requires positive kcalPerCup and kcalPer100g");
    }
    return (cup / per100) * 100;
  }
  const key = input.density && input.density in KIBBLE_DENSITIES
    ? (input.density as DensityPreset)
    : "standard";
  return KIBBLE_DENSITIES[key].gramsPerCup;
}

export function cupsToGrams(cups: number, gramsPerCup: number): number {
  return cups * gramsPerCup;
}

export function gramsToCups(grams: number, gramsPerCup: number): number {
  return grams / gramsPerCup;
}
