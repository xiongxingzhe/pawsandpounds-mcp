// Paws & Pounds — Dog Breed Ideal Weight Snapshot
//
// Source of truth: D:\pawsandpounds\src\constants\breeds.ts (App project,
// read-only reference per AGENTS.md boundary). This is a one-shot JSON
// snapshot — NOT a live import. When the App adds/edits breeds, update
// this file manually and bump `snapshotDate`.
//
// Weight ranges follow AKC + FCI + UK Kennel Club standards where they
// agree; where they diverge (e.g. Rottweiler 43-61 male) the wider range
// covers variance between working / show lines. Ranges represent healthy
// adult "ideal" weight at BCS 4-5/9, not min/max observed.
//
// `lifeFactor` carried over from App's calorie engine (DER multiplier
// accounting for metabolic intensity of breed — e.g. Husky 1.8, Bulldog
// 1.0-1.2). Preserved here so WEB-106 ideal-weight UI can deep-link to
// the calorie calculator with a sensible default.

export interface DogBreed {
  /** URL-safe kebab-case identifier. Differs from App id (snake_case). */
  slug: string
  /** Display name (AKC registry). */
  name: string
  /** Ideal adult weight range (kg) at BCS 4-5 / 9. */
  weightKg: {
    male: [number, number]
    female: [number, number]
  }
  /** Predisposed to obesity. Drives the "watch for overfeeding" badge
   *  and a canine-specific note on brachycephalic / low-metabolism breeds. */
  obesityProne: boolean
  /** DER multiplier for calorie-calculator cross-link. null = fallback 1.4. */
  lifeFactor: number | null
  /** Size category — AKC group conventions don't map cleanly to weight,
   *  so we use kg breakpoints: toy < 6 ≤ small < 12 ≤ medium < 25 ≤ large < 45 ≤ giant. */
  category: 'toy' | 'small' | 'medium' | 'large' | 'giant'
  /** Brachycephalic breeds have disproportionate obesity risk (exercise
   *  intolerance via airway compromise). Flagged for callout on weight page. */
  brachycephalic?: boolean
}

export const DOG_BREEDS_SNAPSHOT_DATE = '2026-04-24'

/**
 * 49 dog breeds sourced from Paws & Pounds App v1 constants.
 * `mixed` placeholder excluded from weight-lookup UI.
 */
export const DOG_BREEDS: DogBreed[] = [
  { slug: 'mixed', name: 'Mixed / Unknown', weightKg: { male: [10, 25], female: [8, 22] }, obesityProne: false, lifeFactor: null, category: 'medium' },
  { slug: 'akita', name: 'Akita', weightKg: { male: [32, 45], female: [25, 36] }, obesityProne: false, lifeFactor: 1.4, category: 'large' },
  { slug: 'australian-shepherd', name: 'Australian Shepherd', weightKg: { male: [23, 29], female: [18, 25] }, obesityProne: false, lifeFactor: 1.6, category: 'medium' },
  { slug: 'basset-hound', name: 'Basset Hound', weightKg: { male: [23, 29], female: [20, 27] }, obesityProne: true, lifeFactor: 1.2, category: 'medium' },
  { slug: 'beagle', name: 'Beagle', weightKg: { male: [10, 13], female: [9, 12] }, obesityProne: true, lifeFactor: 1.4, category: 'small' },
  { slug: 'bernese-mountain-dog', name: 'Bernese Mountain Dog', weightKg: { male: [38, 50], female: [32, 44] }, obesityProne: false, lifeFactor: 1.6, category: 'large' },
  { slug: 'bichon-frise', name: 'Bichon Frise', weightKg: { male: [3, 5], female: [3, 5] }, obesityProne: false, lifeFactor: 1.2, category: 'toy' },
  { slug: 'border-collie', name: 'Border Collie', weightKg: { male: [14, 20], female: [12, 18] }, obesityProne: false, lifeFactor: 1.8, category: 'medium' },
  { slug: 'boston-terrier', name: 'Boston Terrier', weightKg: { male: [7, 11], female: [5, 10] }, obesityProne: true, lifeFactor: 1.2, category: 'small', brachycephalic: true },
  { slug: 'boxer', name: 'Boxer', weightKg: { male: [27, 32], female: [22, 27] }, obesityProne: false, lifeFactor: 1.6, category: 'large', brachycephalic: true },
  { slug: 'bulldog', name: 'Bulldog', weightKg: { male: [23, 25], female: [18, 23] }, obesityProne: true, lifeFactor: 1.2, category: 'medium', brachycephalic: true },
  { slug: 'cavalier-king-charles', name: 'Cavalier King Charles Spaniel', weightKg: { male: [5.5, 8], female: [5, 7.5] }, obesityProne: true, lifeFactor: 1.2, category: 'small' },
  { slug: 'chihuahua', name: 'Chihuahua', weightKg: { male: [1.5, 3], female: [1.5, 3] }, obesityProne: false, lifeFactor: 1.2, category: 'toy' },
  { slug: 'cocker-spaniel', name: 'Cocker Spaniel', weightKg: { male: [12, 15], female: [11, 14] }, obesityProne: true, lifeFactor: 1.4, category: 'medium' },
  { slug: 'dachshund', name: 'Dachshund', weightKg: { male: [7, 15], female: [7, 14] }, obesityProne: true, lifeFactor: 1.2, category: 'small' },
  { slug: 'dalmatian', name: 'Dalmatian', weightKg: { male: [23, 32], female: [20, 27] }, obesityProne: false, lifeFactor: 1.6, category: 'large' },
  { slug: 'doberman', name: 'Doberman Pinscher', weightKg: { male: [34, 45], female: [27, 36] }, obesityProne: false, lifeFactor: 1.6, category: 'large' },
  { slug: 'english-bulldog', name: 'English Bulldog', weightKg: { male: [23, 25], female: [18, 23] }, obesityProne: true, lifeFactor: 1.0, category: 'medium', brachycephalic: true },
  { slug: 'english-springer-spaniel', name: 'English Springer Spaniel', weightKg: { male: [20, 25], female: [18, 23] }, obesityProne: true, lifeFactor: 1.6, category: 'medium' },
  { slug: 'french-bulldog', name: 'French Bulldog', weightKg: { male: [9, 13], female: [8, 12] }, obesityProne: true, lifeFactor: 1.2, category: 'small', brachycephalic: true },
  { slug: 'german-shepherd', name: 'German Shepherd', weightKg: { male: [30, 40], female: [22, 32] }, obesityProne: false, lifeFactor: 1.6, category: 'large' },
  { slug: 'golden-retriever', name: 'Golden Retriever', weightKg: { male: [30, 34], female: [25, 30] }, obesityProne: true, lifeFactor: 1.6, category: 'large' },
  { slug: 'great-dane', name: 'Great Dane', weightKg: { male: [54, 90], female: [45, 59] }, obesityProne: false, lifeFactor: 1.6, category: 'giant' },
  { slug: 'havanese', name: 'Havanese', weightKg: { male: [3.5, 6], female: [3.5, 6] }, obesityProne: false, lifeFactor: 1.2, category: 'toy' },
  { slug: 'jack-russell-terrier', name: 'Jack Russell Terrier', weightKg: { male: [5.5, 8], female: [5, 7] }, obesityProne: false, lifeFactor: 1.6, category: 'small' },
  { slug: 'labrador-retriever', name: 'Labrador Retriever', weightKg: { male: [29, 36], female: [25, 32] }, obesityProne: true, lifeFactor: 1.6, category: 'large' },
  { slug: 'lhasa-apso', name: 'Lhasa Apso', weightKg: { male: [6, 8], female: [5, 7] }, obesityProne: false, lifeFactor: 1.2, category: 'small' },
  { slug: 'maltese', name: 'Maltese', weightKg: { male: [2, 3.6], female: [2, 3.6] }, obesityProne: false, lifeFactor: 1.2, category: 'toy' },
  { slug: 'miniature-schnauzer', name: 'Miniature Schnauzer', weightKg: { male: [5, 9], female: [5, 8] }, obesityProne: true, lifeFactor: 1.4, category: 'small' },
  { slug: 'newfoundland', name: 'Newfoundland', weightKg: { male: [59, 68], female: [45, 54] }, obesityProne: false, lifeFactor: 1.4, category: 'giant' },
  { slug: 'papillon', name: 'Papillon', weightKg: { male: [3, 5], female: [2.5, 4.5] }, obesityProne: false, lifeFactor: 1.2, category: 'toy' },
  { slug: 'pembroke-welsh-corgi', name: 'Pembroke Welsh Corgi', weightKg: { male: [10, 14], female: [10, 13] }, obesityProne: true, lifeFactor: 1.4, category: 'small' },
  { slug: 'pomeranian', name: 'Pomeranian', weightKg: { male: [1.4, 3.2], female: [1.4, 3.2] }, obesityProne: false, lifeFactor: 1.2, category: 'toy' },
  { slug: 'poodle-miniature', name: 'Poodle (Miniature)', weightKg: { male: [5, 7], female: [4.5, 6.5] }, obesityProne: false, lifeFactor: 1.4, category: 'small' },
  { slug: 'poodle-standard', name: 'Poodle (Standard)', weightKg: { male: [20, 32], female: [18, 27] }, obesityProne: false, lifeFactor: 1.4, category: 'medium' },
  { slug: 'pug', name: 'Pug', weightKg: { male: [6, 8], female: [6, 8] }, obesityProne: true, lifeFactor: 1.2, category: 'small', brachycephalic: true },
  { slug: 'rhodesian-ridgeback', name: 'Rhodesian Ridgeback', weightKg: { male: [36, 41], female: [29, 34] }, obesityProne: false, lifeFactor: 1.6, category: 'large' },
  { slug: 'rottweiler', name: 'Rottweiler', weightKg: { male: [43, 61], female: [36, 45] }, obesityProne: false, lifeFactor: 1.6, category: 'giant' },
  { slug: 'samoyed', name: 'Samoyed', weightKg: { male: [20, 30], female: [16, 22] }, obesityProne: false, lifeFactor: 1.6, category: 'medium' },
  { slug: 'shetland-sheepdog', name: 'Shetland Sheepdog', weightKg: { male: [8, 12], female: [7, 11] }, obesityProne: false, lifeFactor: 1.4, category: 'small' },
  { slug: 'shiba-inu', name: 'Shiba Inu', weightKg: { male: [8, 11], female: [6.5, 9] }, obesityProne: false, lifeFactor: 1.4, category: 'small' },
  { slug: 'shih-tzu', name: 'Shih Tzu', weightKg: { male: [4, 7], female: [4, 7] }, obesityProne: true, lifeFactor: 1.2, category: 'toy', brachycephalic: true },
  { slug: 'siberian-husky', name: 'Siberian Husky', weightKg: { male: [20, 27], female: [16, 23] }, obesityProne: false, lifeFactor: 1.8, category: 'medium' },
  { slug: 'staffordshire-bull-terrier', name: 'Staffordshire Bull Terrier', weightKg: { male: [13, 17], female: [11, 15] }, obesityProne: false, lifeFactor: 1.4, category: 'medium' },
  { slug: 'vizsla', name: 'Vizsla', weightKg: { male: [20, 29], female: [18, 25] }, obesityProne: false, lifeFactor: 1.8, category: 'medium' },
  { slug: 'weimaraner', name: 'Weimaraner', weightKg: { male: [30, 40], female: [25, 35] }, obesityProne: false, lifeFactor: 1.8, category: 'large' },
  { slug: 'west-highland-terrier', name: 'West Highland White Terrier', weightKg: { male: [7, 10], female: [6, 9] }, obesityProne: false, lifeFactor: 1.2, category: 'small' },
  { slug: 'whippet', name: 'Whippet', weightKg: { male: [9, 14], female: [8, 13] }, obesityProne: false, lifeFactor: 1.6, category: 'small' },
  { slug: 'yorkshire-terrier', name: 'Yorkshire Terrier', weightKg: { male: [2, 3.2], female: [2, 3.2] }, obesityProne: false, lifeFactor: 1.2, category: 'toy' },
]

export const DOG_BREEDS_NAMED = DOG_BREEDS.filter((b) => b.slug !== 'mixed')

export function getDogBreed(slug: string): DogBreed | undefined {
  return DOG_BREEDS.find((b) => b.slug === slug)
}

export function getDogBreedOverallRange(
  breed: DogBreed,
): [number, number] {
  const lo = Math.min(breed.weightKg.male[0], breed.weightKg.female[0])
  const hi = Math.max(breed.weightKg.male[1], breed.weightKg.female[1])
  return [lo, hi]
}
