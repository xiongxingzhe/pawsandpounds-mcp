/** Cup ↔ grams helpers (mirrors site /tools/cup-to-grams-converter). */
export declare const KIBBLE_DENSITIES: {
    readonly light: {
        readonly label: "Light / low-cal kibble";
        readonly gramsPerCup: 85;
    };
    readonly standard: {
        readonly label: "Standard adult kibble";
        readonly gramsPerCup: 110;
    };
    readonly dense: {
        readonly label: "Dense / high-protein kibble";
        readonly gramsPerCup: 130;
    };
    readonly puppy: {
        readonly label: "Puppy kibble (high energy)";
        readonly gramsPerCup: 120;
    };
};
export type DensityPreset = keyof typeof KIBBLE_DENSITIES;
export declare function resolveGramsPerCup(input: {
    density?: DensityPreset | "custom";
    kcalPerCup?: number;
    kcalPer100g?: number;
}): number;
export declare function cupsToGrams(cups: number, gramsPerCup: number): number;
export declare function gramsToCups(grams: number, gramsPerCup: number): number;
