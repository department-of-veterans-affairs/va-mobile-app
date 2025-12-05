export const allergyKeys = {
  allergies: ['allergies'] as const,
  allergiesWithVersion: (version: string) => ['allergies', version] as const,
}
