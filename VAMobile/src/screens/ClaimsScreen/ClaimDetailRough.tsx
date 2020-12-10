import { AlertBox, Box, SegmentedControl, TextArea, TextView } from '../../components'
import { View } from 'react-native'
import { claim } from './claimData'
import { formatDateMMMMDDYYYY } from '../../utils/formattingUtils'
import ClaimPhaseRough from './ClaimPhaseRough'
import React, { FC } from 'react'
import theme from '../../styles/themes/standardTheme'

// TODO: when appeals is added in this will need to be updated unless we just say forget it and give appeals their own helpers
export function getClaimType(claim: any): string {
  return claim.attributes.claimType || 'Disability Compensation'
}

const itemsNeedingAttentionFromVet = (events: any) => {
  return events.filter((event: any) => event.status === 'NEEDED' && event.type === 'still_need_from_you_list').length
}

const getUserPhase = (phase: number) => {
  if (phase < 3) {
    return phase
  } else if (phase >= 3 && phase < 7) {
    return 3
  }
  return phase - 3
}

const getPhaseNumber = (phase: string) => {
  return parseInt(phase.replace('phase', ''), 10)
}

const getItemDate = (item) => {
  if (item.receivedDate) {
    return item.receivedDate
  } else if (item.documents && item.documents.length) {
    return item.documents[item.documents.length - 1].uploadDate
  } else if (item.type === 'other_documents_list' && item.uploadDate) {
    return item.uploadDate
  }

  return item.date
}

const isEventOrPrimaryPhase = (event: any) => {
  if (event.type === 'phase_entered') {
    return event.phase <= 3 || event.phase >= 7
  }

  return !!getItemDate(event)
}

const groupTimelineActivity = (events: any) => {
  const phases = {}
  let activity: any[] = []
  const phaseEvents = events
    .map((event) => {
      if (event.type.startsWith('phase')) {
        return {
          type: 'phase_entered',
          phase: getPhaseNumber(event.type) + 1,
          date: event.date,
        }
      }
      return event
    })
    .filter(isEventOrPrimaryPhase)
  phaseEvents.forEach((event) => {
    if (event.type.startsWith('phase')) {
      activity.push(event)
      phases[getUserPhase(event.phase)] = activity
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

export type ClaimDetailRoughProps = {}
const ClaimDetailRough: FC<ClaimDetailRoughProps> = () => {
  const { attributes } = claim
  console.log(groupTimelineActivity(attributes.eventsTimeline))
  return (
    <View>
      <TextArea>
        <TextView>{getClaimType(claim)}</TextView>
        <TextView>Received {formatDateMMMMDDYYYY(attributes.dateFiled)}</TextView>
        <SegmentedControl
          onChange={() => {
            /*details/issues*/
          }}
          values={['status', 'issues']}
          titles={['Status', 'Issues']}
        />
      </TextArea>
      {!claim.attributes.decisionLetterSent && claim.attributes.open && claim.attributes.documentsNeeded && itemsNeedingAttentionFromVet(attributes.eventsTimeline) > 0 && (
        <Box mx={theme.dimensions.gutter} my={theme.dimensions.marginBetween}>
          <AlertBox border={'warning'} background={'noCardBackground'} title={`You have ${itemsNeedingAttentionFromVet(attributes.eventsTimeline)} file requests from VA`} />
        </Box>
      )}
      <ClaimPhaseRough phase={1} current={getUserPhase(attributes.phase)} />
      <ClaimPhaseRough phase={2} current={getUserPhase(attributes.phase)} />
      <ClaimPhaseRough phase={3} current={getUserPhase(attributes.phase)} />
      <ClaimPhaseRough phase={4} current={getUserPhase(attributes.phase)} />
      <ClaimPhaseRough phase={5} current={getUserPhase(attributes.phase)} />
    </View>
  )
}

export default ClaimDetailRough
