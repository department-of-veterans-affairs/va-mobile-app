import { Box, TextArea, TextView, VAButton, VAIcon, VA_ICON_MAP } from 'components'
import { ClaimAttributesData, ClaimEventData } from 'store/api'
import { DateTime } from 'luxon'
import { Pressable } from 'react-native'
import { groupTimelineActivity, itemsNeedingAttentionFromVet, needItemsFromVet } from 'utils/claims'
import PhaseIndicator from './PhaseIndicator'
import React, { FC, useState } from 'react'
import theme from 'styles/themes/standardTheme'

/** returns the heading string by phase */
const getHeading = (phase: number): string => {
  switch (phase) {
    case 1: {
      return 'Claim Received'
    }
    case 2: {
      return 'Initial Review'
    }
    case 3: {
      return 'Evidence gathering, review, and decision'
    }
    case 4: {
      return 'Preparation for notification'
    }
    case 5: {
      return 'Complete'
    }
  }
  return ''
}

/** returns the details string to show by phase for the expand area */
const getDetails = (phase: number): string => {
  switch (phase) {
    case 1: {
      return 'Thank you. VA received your claim'
    }
    case 2: {
      return 'Your claim has been assigned to a reviewer who is determining if additional information is needed.'
    }
    case 3: {
      return 'If we need more information, we’ll request it from you, health care providers, governmental agencies, or others. Once we have all the information we need, we’ll review it and send your claim to the rating specialist for a decision.'
    }
    case 4: {
      return 'We are preparing your claim decision packet to be mailed.'
    }
    case 5: {
      return 'Complete'
    }
  }
  return ''
}

/**
 * takes the events array, sorts is and returns the latest updated date
 * @param events - events array from the claim attributes
 * @param phase - phase that this component is rendering for
 * @returns a string representing the date that this phase was last updated
 */
const updatedLast = (events: ClaimEventData[], phase: number): string => {
  const phases = groupTimelineActivity(events)
  const currentPhase = phases[`${phase}`]
  currentPhase.sort((a, b) => {
    const val1: number = a.date ? DateTime.fromISO(a.date).millisecond : Number.POSITIVE_INFINITY
    const val2: number = b.date ? DateTime.fromISO(b.date).millisecond : Number.POSITIVE_INFINITY
    return val2 - val1
  })
  console.log(`Phase ${phase}`)
  console.log(currentPhase)
  const lastUpdate = currentPhase[0]?.date
  return lastUpdate ? DateTime.fromISO(lastUpdate).toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' }) : ''
}

// TODO: Update VA Button to have optional marginY attribute to reduce bottom spacing in this comppnent on phase 3

// TODO: Documentation

/**
 * props for ClaimPhase components
 */
export type ClaimPhaseProps = {
  /** phase number of the current indicator */
  phase: number
  /** phase that the current claim is on */
  current: number
  /** attributes object from ClaimData */
  attributes: ClaimAttributesData
}

/**
 * Component for rendering each phase of a claim's lifetime.
 */
const ClaimPhase: FC<ClaimPhaseProps> = ({ phase, current, attributes }) => {
  const [expanded, setExpanded] = useState(false)
  const iconName: keyof typeof VA_ICON_MAP = expanded ? 'ArrowUp' : 'ArrowDown'

  return (
    <TextArea>
      <Box flexDirection={'row'}>
        <PhaseIndicator phase={phase} current={current} />
        <Box flexDirection={'column'} justifyContent={'flex-start'} flex={1}>
          <TextView variant={'MobileBodyBold'}>{getHeading(phase)}</TextView>
          {phase <= current && <TextView variant={'MobileBody'}>{updatedLast(attributes.eventsTimeline, phase)}</TextView>}
        </Box>
        {phase <= current && (
          <Pressable onPress={(): void => setExpanded(!expanded)}>
            <VAIcon name={iconName} fill={'#000'} />
          </Pressable>
        )}
      </Box>
      {expanded && (
        <Box mt={theme.dimensions.marginBetweenCards}>
          <TextView variant={'MobileBody'}>{getDetails(phase)}</TextView>
        </Box>
      )}
      {phase === 3 && needItemsFromVet(attributes) && (
        <Box mt={theme.dimensions.marginBetween}>
          <TextView variant={'MobileBodyBold'}>You have {itemsNeedingAttentionFromVet(attributes.eventsTimeline)} file requests from VA</TextView>
          <VAButton onPress={(): void => {}} label={'View File Requests'} textColor={'primaryContrast'} backgroundColor={'button'} />
        </Box>
      )}
    </TextArea>
  )
}

export default ClaimPhase
