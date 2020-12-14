import { ClaimAttributesData, ClaimEventData } from 'store/api'

/** function that returns the number of tracked items that need uploads from a claimant */
export const itemsNeedingAttentionFromVet = (events: ClaimEventData[]): number => {
  return events.filter((event: ClaimEventData) => event.status === 'NEEDED' && event.type === 'still_need_from_you_list').length
}

/** function that returns a boolean for a claim indicating if there are files that can be uploaded */
export const needItemsFromVet = (attributes: ClaimAttributesData): boolean => {
  return !attributes.decisionLetterSent && attributes.open && attributes.documentsNeeded && itemsNeedingAttentionFromVet(attributes.eventsTimeline) > 0
}
