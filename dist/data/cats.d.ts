export interface CatBreed {
    /** URL-safe kebab-case identifier. Differs from App id (snake_case). */
    slug: string;
    /** Display name (matches CFA / TICA registry). */
    name: string;
    /** Ideal adult weight range (kg) at BCS 4-5 / 9. */
    weightKg: {
        male: [number, number];
        female: [number, number];
    };
    /** Breed is predisposed to obesity (low activity, food-motivated, or
     *  genetic propensity). Drives the "watch for overfeeding" badge. */
    obesityProne: boolean;
    /** Size category for UI filtering. Cats: small < 4kg ≤ medium < 6kg ≤ large. */
    category: 'small' | 'medium' | 'large';
}
export declare const CAT_BREEDS_SNAPSHOT_DATE = "2026-04-24";
/**
 * 29 cat breeds sourced from Paws & Pounds App v1 constants.
 * `mixed` placeholder excluded from weight-lookup UI (it has no single
 * "ideal" range) but retained here for completeness / calculator fallbacks.
 */
export declare const CAT_BREEDS: CatBreed[];
/** Exclude `mixed` for the UI dropdown (it has no single ideal range). */
export declare const CAT_BREEDS_NAMED: CatBreed[];
export declare function getCatBreed(slug: string): CatBreed | undefined;
/** Overall ideal weight span across both sexes (for UI display). */
export declare function getCatBreedOverallRange(breed: CatBreed): [number, number];
