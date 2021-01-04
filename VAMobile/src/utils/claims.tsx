import { ClaimAttributesData, ClaimEventData, ClaimPhaseData } from 'store/api'

/** function that returns the tracked items that need uploads from a claimant */
export const itemsNeedingAttentionFromVet = (events: ClaimEventData[]): ClaimEventData[] => {
  return events.filter((event: ClaimEventData) => event.status === 'NEEDED' && event.type === 'still_need_from_you_list' && !event.uploaded && event.uploadsAllowed)
}

/** function that returns the number of tracked items that need uploads from a claimant */
export const numberOfItemsNeedingAttentionFromVet = (events: ClaimEventData[]): number => {
  return itemsNeedingAttentionFromVet(events).length
}

/** function that returns a boolean for a claim indicating if there are files that can be uploaded */
export const needItemsFromVet = (attributes: ClaimAttributesData): boolean => {
  return !attributes.decisionLetterSent && attributes.open && attributes.documentsNeeded && numberOfItemsNeedingAttentionFromVet(attributes.eventsTimeline) > 0
}

/** function to get the claim phase in base 5 rather than base 10 */
export const getUserPhase = (phase: number): number => {
  if (phase < 3) {
    return phase
  } else if (phase >= 3 && phase < 7) {
    return 3
  }
  return phase - 3
}

/** gets the correct date from each item in an event timeline */
const getItemDate = (item: ClaimEventData): string => {
  if (item.receivedDate) {
    return item.receivedDate
  } else if (item.documents && item.documents.length) {
    return item.documents[item.documents.length - 1].uploadDate
  } else if (item.type === 'other_documents_list' && item.uploadDate) {
    return item.uploadDate
  }

  return item.date ? item.date : ''
}

/** checks to see if this is an event that kicks off a phase that is tracked or if it falls in the middle phases
 * that we roll into phase 3
 */
const isEventOrPrimaryPhase = (event: ClaimEventData): boolean => {
  if (event.type === 'phase_entered' && event.phase) {
    return event.phase <= 3 || event.phase >= 7
  }

  return !!getItemDate(event)
}

/** takse a string that is in the event timeline as 'phase2' and returns a number to represent the phase */
const getPhaseNumber = (phase: string): number => {
  return parseInt(phase.replace('phase', ''), 10)
}

/** groups claim events by phase */
export const groupTimelineActivity = (events: ClaimEventData[]): ClaimPhaseData => {
  const phases: { [key: string]: ClaimEventData[] } = {}
  let activity: ClaimEventData[] = []
  const phaseEvents = events
    .map((event) => {
      if (event.type.startsWith('phase')) {
        return {
          type: 'phase_entered',
          phase: getPhaseNumber(event.type) + 1,
          date: event.date,
        } as ClaimEventData
      }
      return event
    })
    .filter(isEventOrPrimaryPhase)
  phaseEvents.forEach((event) => {
    if (event.type.startsWith('phase') && event.phase) {
      activity.push(event)
      phases[`${getUserPhase(event.phase)}`] = activity
      activity = []
    } else {
      activity.push(event)
    }
  })
  if (activity.length > 0) {
    phases[1] = activity
  }
  return phases
}
