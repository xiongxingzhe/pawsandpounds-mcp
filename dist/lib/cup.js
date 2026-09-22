/** Cup ↔ grams helpers (mirrors site /tools/cup-to-grams-converter). */
export const KIBBLE_DENSITIES = {
    light: { label: "Light / low-cal kibble", gramsPerCup: 85 },
    standard: { label: "Standard adult kibble", gramsPerCup: 110 },
    dense: { label: "Dense / high-protein kibble", gramsPerCup: 130 },
    puppy: { label: "Puppy kibble (high energy)", gramsPerCup: 120 },
};
export function resolveGramsPerCup(input) {
    if (input.density === "custom") {
        const cup = input.kcalPerCup ?? 0;
        const per100 = input.kcalPer100g ?? 0;
        if (cup <= 0 || per100 <= 0) {
            throw new Error("custom density requires positive kcalPerCup and kcalPer100g");
        }
        return (cup / per100) * 100;
    }
    const key = input.density && input.density in KIBBLE_DENSITIES
        ? input.density
        : "standard";
    return KIBBLE_DENSITIES[key].gramsPerCup;
}
export function cupsToGrams(cups, gramsPerCup) {
    return cups * gramsPerCup;
}
export function gramsToCups(grams, gramsPerCup) {
    return grams / gramsPerCup;
}
