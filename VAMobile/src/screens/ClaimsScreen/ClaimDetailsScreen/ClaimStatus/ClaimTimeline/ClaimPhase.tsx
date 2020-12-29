import { Box, TextArea, TextView, VAButton, VAIcon, VA_ICON_MAP } from 'components'
import { ClaimAttributesData, ClaimEventData } from 'store/api'
import { DateTime } from 'luxon'
import { NAMESPACE } from 'constants/namespaces'
import { Pressable } from 'react-native'
import { TFunction } from 'i18next'
import { groupTimelineActivity, itemsNeedingAttentionFromVet, needItemsFromVet } from 'utils/claims'
import { sortByDate } from 'utils/common'
import { useTheme, useTranslation } from 'utils/hooks'
import PhaseIndicator from './PhaseIndicator'
import React, { FC, useState } from 'react'

/** returns the heading string by phase */
const getHeading = (phase: number, translate: TFunction): string => {
  switch (phase) {
    case 1: {
      return translate('claimPhase.heading.phaseOne')
    }
    case 2: {
      return translate('claimPhase.heading.phaseTwo')
    }
    case 3: {
      return translate('claimPhase.heading.phaseThree')
    }
    case 4: {
      return translate('claimPhase.heading.phaseFour')
    }
    case 5: {
      return translate('claimPhase.heading.phaseFive')
    }
  }
  return ''
}

/** returns the details string to show by phase for the expand area */
const getDetails = (phase: number, translate: TFunction): string => {
  switch (phase) {
    case 1: {
      return translate('claimPhase.details.phaseOne')
    }
    case 2: {
      return translate('claimPhase.details.phaseTwo')
    }
    case 3: {
      return translate('claimPhase.details.phaseThree')
    }
    case 4: {
      return translate('claimPhase.details.phaseFour')
    }
    case 5: {
      return translate('claimPhase.details.phaseFive')
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
  const currentPhase = (phases[`${phase}`] as unknown) as Array<{ [key: string]: string }>

  sortByDate(currentPhase, 'date', true)

  const lastUpdate = currentPhase[0]?.date
  return lastUpdate ? DateTime.fromISO(lastUpdate).toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' }) : ''
}

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
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const { marginBetweenCards, marginBetween } = theme.dimensions
  const { eventsTimeline } = attributes
  return (
    <TextArea>
      <Box flexDirection={'row'}>
        <PhaseIndicator phase={phase} current={current} />
        <Box flexDirection={'column'} justifyContent={'flex-start'} flex={1}>
          <TextView variant={'MobileBodyBold'}>{getHeading(phase, t)}</TextView>
          {phase <= current && <TextView variant={'MobileBody'}>{updatedLast(eventsTimeline, phase)}</TextView>}
        </Box>
        {phase <= current && (
          <Pressable onPress={(): void => setExpanded(!expanded)} accessibilityState={{ expanded }}>
            <VAIcon name={iconName} fill={'#000'} />
          </Pressable>
        )}
      </Box>
      {expanded && (
        <Box mt={marginBetweenCards}>
          <TextView variant={'MobileBody'}>{getDetails(phase, t)}</TextView>
        </Box>
      )}
      {phase === 3 && needItemsFromVet(attributes) && (
        <Box mt={marginBetween}>
          <TextView variant={'MobileBodyBold'}>{t('claimPhase.youHaveFileRequests', { numberOfRequests: itemsNeedingAttentionFromVet(eventsTimeline) })}</TextView>
          <Box mt={marginBetween}>
            <VAButton
              onPress={(): void => {}}
              label={t('claimPhase.fileRequests.button.label')}
              textColor={'primaryContrast'}
              backgroundColor={'button'}
              a11yHint={'claimPhase.fileRequests.button.a11yHint'}
            />
          </Box>
        </Box>
      )}
    </TextArea>
  )
}

export default ClaimPhase
