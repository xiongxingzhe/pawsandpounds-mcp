// Paws & Pounds — Cat Breed Ideal Weight Snapshot
//
// Source of truth: D:\pawsandpounds\src\constants\breeds.ts (App project,
// read-only reference per AGENTS.md boundary). This is a one-shot JSON
// snapshot — NOT a live import. When the App adds/edits breeds, update
// this file manually and bump `snapshotDate`.
//
// Weight ranges follow breed-club standards (CFA / TICA / CFA-recognised
// weight guidelines); ranges represent healthy adult "ideal" weight at
// BCS 4-5/9, not min/max observed. Male > female is typical sexual
// dimorphism in cats — usually 0.5-1.5 kg spread.

export interface CatBreed {
  /** URL-safe kebab-case identifier. Differs from App id (snake_case). */
  slug: string
  /** Display name (matches CFA / TICA registry). */
  name: string
  /** Ideal adult weight range (kg) at BCS 4-5 / 9. */
  weightKg: {
    male: [number, number]
    female: [number, number]
  }
  /** Breed is predisposed to obesity (low activity, food-motivated, or
   *  genetic propensity). Drives the "watch for overfeeding" badge. */
  obesityProne: boolean
  /** Size category for UI filtering. Cats: small < 4kg ≤ medium < 6kg ≤ large. */
  category: 'small' | 'medium' | 'large'
}

export const CAT_BREEDS_SNAPSHOT_DATE = '2026-04-24'

/**
 * 29 cat breeds sourced from Paws & Pounds App v1 constants.
 * `mixed` placeholder excluded from weight-lookup UI (it has no single
 * "ideal" range) but retained here for completeness / calculator fallbacks.
 */
export const CAT_BREEDS: CatBreed[] = [
  { slug: 'mixed', name: 'Mixed / Unknown', weightKg: { male: [4, 6], female: [3.5, 5] }, obesityProne: false, category: 'medium' },
  { slug: 'abyssinian', name: 'Abyssinian', weightKg: { male: [3.6, 5.4], female: [2.7, 4.5] }, obesityProne: false, category: 'small' },
  { slug: 'american-shorthair', name: 'American Shorthair', weightKg: { male: [5, 7], female: [3.5, 5.5] }, obesityProne: true, category: 'large' },
  { slug: 'balinese', name: 'Balinese', weightKg: { male: [3.5, 5], female: [2.5, 4] }, obesityProne: false, category: 'small' },
  { slug: 'bengal', name: 'Bengal', weightKg: { male: [4.5, 6.8], female: [3.6, 5.4] }, obesityProne: false, category: 'medium' },
  { slug: 'birman', name: 'Birman', weightKg: { male: [4, 6], female: [3, 5] }, obesityProne: false, category: 'medium' },
  { slug: 'bombay', name: 'Bombay', weightKg: { male: [4, 5], female: [3, 4] }, obesityProne: true, category: 'small' },
  { slug: 'british-shorthair', name: 'British Shorthair', weightKg: { male: [5.5, 8], female: [4, 6] }, obesityProne: true, category: 'large' },
  { slug: 'burmese', name: 'Burmese', weightKg: { male: [4, 5.5], female: [3, 4.5] }, obesityProne: true, category: 'medium' },
  { slug: 'chartreux', name: 'Chartreux', weightKg: { male: [5, 7], female: [3, 5] }, obesityProne: true, category: 'large' },
  { slug: 'cornish-rex', name: 'Cornish Rex', weightKg: { male: [3, 4.5], female: [2.5, 3.5] }, obesityProne: false, category: 'small' },
  { slug: 'devon-rex', name: 'Devon Rex', weightKg: { male: [3, 4.5], female: [2.5, 3.5] }, obesityProne: false, category: 'small' },
  { slug: 'domestic-shorthair', name: 'Domestic Shorthair', weightKg: { male: [3.5, 5.5], female: [3, 4.5] }, obesityProne: true, category: 'medium' },
  { slug: 'exotic-shorthair', name: 'Exotic Shorthair', weightKg: { male: [4.5, 7], female: [3, 5] }, obesityProne: true, category: 'medium' },
  { slug: 'himalayan', name: 'Himalayan', weightKg: { male: [4.5, 6], female: [3.5, 5] }, obesityProne: true, category: 'medium' },
  { slug: 'maine-coon', name: 'Maine Coon', weightKg: { male: [6, 10], female: [4, 7] }, obesityProne: false, category: 'large' },
  { slug: 'manx', name: 'Manx', weightKg: { male: [4, 5.5], female: [3, 5] }, obesityProne: true, category: 'medium' },
  { slug: 'norwegian-forest', name: 'Norwegian Forest Cat', weightKg: { male: [5, 9], female: [3.5, 6] }, obesityProne: false, category: 'large' },
  { slug: 'oriental-shorthair', name: 'Oriental Shorthair', weightKg: { male: [3.5, 5.5], female: [2.5, 4] }, obesityProne: false, category: 'small' },
  { slug: 'persian', name: 'Persian', weightKg: { male: [4.5, 6], female: [3.5, 5] }, obesityProne: true, category: 'medium' },
  { slug: 'ragamuffin', name: 'RagaMuffin', weightKg: { male: [5.5, 9], female: [4.5, 7] }, obesityProne: false, category: 'large' },
  { slug: 'ragdoll', name: 'Ragdoll', weightKg: { male: [5.5, 9], female: [4, 7] }, obesityProne: false, category: 'large' },
  { slug: 'russian-blue', name: 'Russian Blue', weightKg: { male: [4, 6], female: [3, 5] }, obesityProne: true, category: 'medium' },
  { slug: 'scottish-fold', name: 'Scottish Fold', weightKg: { male: [4, 6], female: [3, 5] }, obesityProne: true, category: 'medium' },
  { slug: 'siamese', name: 'Siamese', weightKg: { male: [4, 5.5], female: [3, 4.5] }, obesityProne: false, category: 'medium' },
  { slug: 'siberian', name: 'Siberian', weightKg: { male: [5, 8], female: [3.5, 6] }, obesityProne: false, category: 'large' },
  { slug: 'somali', name: 'Somali', weightKg: { male: [4, 5.5], female: [3, 4.5] }, obesityProne: false, category: 'medium' },
  { slug: 'sphynx', name: 'Sphynx', weightKg: { male: [3.5, 5.5], female: [3, 4.5] }, obesityProne: false, category: 'small' },
  { slug: 'tonkinese', name: 'Tonkinese', weightKg: { male: [3.5, 5.5], female: [2.5, 4] }, obesityProne: false, category: 'small' },
  { slug: 'turkish-angora', name: 'Turkish Angora', weightKg: { male: [3.5, 5], female: [2.5, 4] }, obesityProne: false, category: 'small' },
]

/** Exclude `mixed` for the UI dropdown (it has no single ideal range). */
export const CAT_BREEDS_NAMED = CAT_BREEDS.filter((b) => b.slug !== 'mixed')

export function getCatBreed(slug: string): CatBreed | undefined {
  return CAT_BREEDS.find((b) => b.slug === slug)
}

/** Overall ideal weight span across both sexes (for UI display). */
export function getCatBreedOverallRange(
  breed: CatBreed,
): [number, number] {
  const lo = Math.min(breed.weightKg.male[0], breed.weightKg.female[0])
  const hi = Math.max(breed.weightKg.male[1], breed.weightKg.female[1])
  return [lo, hi]
}
