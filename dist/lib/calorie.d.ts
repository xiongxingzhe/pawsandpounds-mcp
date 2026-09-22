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
export declare const ACTIVITY_FACTORS: {
    readonly cat: {
        readonly weight_loss: 0.8;
        readonly neutered_indoor: 1.2;
        readonly intact_active: 1.4;
    };
    readonly dog: {
        readonly weight_loss: 1;
        readonly neutered_low: 1.2;
        readonly neutered_moderate: 1.4;
        readonly intact_active: 1.6;
    };
    readonly weight_gain_multiplier: 1.2;
};
export declare function lbToKg(lb: number): number;
export declare function kgToLb(kg: number): number;
/** Resting Energy Requirement: RER = 70 × weight_kg^0.75 */
export declare function calculateRER(weightKg: number): number;
/**
 * Resolve the maintenance activity factor based on species, neutered status,
 * and activity level. Mirrors the App engine's rules.
 */
export declare function getMaintenanceFactor(species: Species, neutered: boolean, activityLevel: ActivityLevel): number;
/** Species-specific weight-loss multiplier (cat 0.8, dog 1.0) */
export declare function getWeightLossFactor(species: Species): number;
/** Max safe weekly weight loss rate as fraction of body weight (cat 2%, dog 3%) */
export declare function getSafeWeeklyRate(species: Species): number;
export declare function calculateCaloriePlan(input: CalorieInput): CaloriePlanResult;
