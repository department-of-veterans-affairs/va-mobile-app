export const travelPayKeys = {
  claims: ['travelPayClaims'] as const,
  claimDetails: (id: string) => ['travelPayClaimDetails', id] as const,
  downloadDocument: 'downloadTravelPayDocument' as const,
}
