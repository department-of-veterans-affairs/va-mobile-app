import { VeteranStatusCardResponse } from 'api/types/VeteranStatusCardData'

export const deriveVscStatus = (payload?: VeteranStatusCardResponse): string | undefined => {
  if (!payload) return undefined

  const { veteranStatus, notConfirmedReason, confirmation_status } = payload.attributes

  if (veteranStatus === 'confirmed') return 'CONFIRMED'

  if (veteranStatus === 'not confirmed') {
    if (notConfirmedReason === 'ERROR') return 'ERROR'
    if (notConfirmedReason === 'PERSON_NOT_FOUND') return 'PERSON_NOT_FOUND'
  }

  if (confirmation_status) return confirmation_status

  return 'UNKNOWN_REASON'
}
