import { AlertBox, Box } from 'components'
import { ClaimAttributesData, ClaimEventData, ClaimPhaseData } from 'store/api'
import { itemsNeedingAttentionFromVet, needItemsFromVet } from 'utils/claims'
import ClaimPhaseRough from './ClaimPhaseRough'
import React, { FC } from 'react'
import theme from 'styles/themes/standardTheme'

const getUserPhase = (phase: number): number => {
  if (phase < 3) {
    return phase
  } else if (phase >= 3 && phase < 7) {
    return 3
  }
  return phase - 3
}

const getPhaseNumber = (phase: string): number => {
  return parseInt(phase.replace('phase', ''), 10)
}

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

const isEventOrPrimaryPhase = (event: ClaimEventData): boolean => {
  if (event.type === 'phase_entered' && event.phase) {
    return event.phase <= 3 || event.phase >= 7
  }

  return !!getItemDate(event)
}

const groupTimelineActivity = (events: ClaimEventData[], currentPhase: number): ClaimPhaseData => {
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
    if (event.type.startsWith('phase')) {
      activity.push(event)
      phases[`${getUserPhase(currentPhase)}`] = activity
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

export type ClaimDetailRoughProps = {
  attributes: ClaimAttributesData
}
const ClaimDetailRough: FC<ClaimDetailRoughProps> = ({ attributes }) => {
  return (
    <Box mt={needItemsFromVet(attributes) ? 0 : theme.dimensions.marginBetweenCards} mb={theme.dimensions.marginBetweenCards}>
      {needItemsFromVet(attributes) && (
        <Box mx={theme.dimensions.gutter} my={theme.dimensions.marginBetween}>
          <AlertBox border={'warning'} background={'noCardBackground'} title={`You have ${itemsNeedingAttentionFromVet(attributes.eventsTimeline)} file requests from VA`} />
        </Box>
      )}
      <ClaimPhaseRough phase={1} current={getUserPhase(attributes.phase)} updatedDate={'today'} attributes={attributes} />
      <ClaimPhaseRough phase={2} current={getUserPhase(attributes.phase)} updatedDate={'today'} attributes={attributes} />
      <ClaimPhaseRough phase={3} current={getUserPhase(attributes.phase)} updatedDate={'today'} attributes={attributes} />
      <ClaimPhaseRough phase={4} current={getUserPhase(attributes.phase)} updatedDate={'today'} attributes={attributes} />
      <ClaimPhaseRough phase={5} current={getUserPhase(attributes.phase)} updatedDate={'today'} attributes={attributes} />
    </Box>
  )
}

export default ClaimDetailRough
