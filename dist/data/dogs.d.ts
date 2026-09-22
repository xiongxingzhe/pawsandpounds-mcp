export interface DogBreed {
    /** URL-safe kebab-case identifier. Differs from App id (snake_case). */
    slug: string;
    /** Display name (AKC registry). */
    name: string;
    /** Ideal adult weight range (kg) at BCS 4-5 / 9. */
    weightKg: {
        male: [number, number];
        female: [number, number];
    };
    /** Predisposed to obesity. Drives the "watch for overfeeding" badge
     *  and a canine-specific note on brachycephalic / low-metabolism breeds. */
    obesityProne: boolean;
    /** DER multiplier for calorie-calculator cross-link. null = fallback 1.4. */
    lifeFactor: number | null;
    /** Size category — AKC group conventions don't map cleanly to weight,
     *  so we use kg breakpoints: toy < 6 ≤ small < 12 ≤ medium < 25 ≤ large < 45 ≤ giant. */
    category: 'toy' | 'small' | 'medium' | 'large' | 'giant';
    /** Brachycephalic breeds have disproportionate obesity risk (exercise
     *  intolerance via airway compromise). Flagged for callout on weight page. */
    brachycephalic?: boolean;
}
export declare const DOG_BREEDS_SNAPSHOT_DATE = "2026-04-24";
/**
 * 49 dog breeds sourced from Paws & Pounds App v1 constants.
 * `mixed` placeholder excluded from weight-lookup UI.
 */
export declare const DOG_BREEDS: DogBreed[];
export declare const DOG_BREEDS_NAMED: DogBreed[];
export declare function getDogBreed(slug: string): DogBreed | undefined;
export declare function getDogBreedOverallRange(breed: DogBreed): [number, number];
