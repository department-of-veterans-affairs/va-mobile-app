import { Pressable, PressableProps } from 'react-native'
import React, { FC, ReactElement, useState } from 'react'

import { DateTime } from 'luxon'
import { TFunction } from 'i18next'

import { Box, TextArea, TextView, VAButton, VAIcon, VA_ICON_MAP } from 'components'
import { ClaimAttributesData, ClaimEventData } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { groupTimelineActivity, needItemsFromVet, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { sortByDate } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import PhaseIndicator from './PhaseIndicator'

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
  /** given claims ID */
  claimID: string
}

/**
 * Component for rendering each phase of a claim's lifetime.
 */
const ClaimPhase: FC<ClaimPhaseProps> = ({ phase, current, attributes, claimID }) => {
  const [expanded, setExpanded] = useState(false)
  const iconName: keyof typeof VA_ICON_MAP = expanded ? 'ArrowUp' : 'ArrowDown'
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { marginBetweenCards, marginBetween } = theme.dimensions
  const { eventsTimeline } = attributes

  const getPhaseData = (): ReactElement => {
    const phaseLessThanEqualToCurrent = phase <= current
    const heading = getHeading(phase, t)
    const updatedLastDate = phaseLessThanEqualToCurrent ? updatedLast(eventsTimeline, phase) : ''

    const data = (
      <Box flexDirection={'row'}>
        <PhaseIndicator phase={phase} current={current} />
        <Box flexDirection={'column'} justifyContent={'flex-start'} flex={1}>
          <TextView variant={'MobileBodyBold'} selectable={!phaseLessThanEqualToCurrent}>
            {heading}
          </TextView>
          {phaseLessThanEqualToCurrent && <TextView variant={'MobileBody'}>{updatedLastDate}</TextView>}
        </Box>
        {phaseLessThanEqualToCurrent && <VAIcon name={iconName} fill={'#000'} />}
      </Box>
    )

    const pressableProps: PressableProps = {
      onPress: (): void => setExpanded(!expanded),
      accessibilityState: { expanded },
      accessibilityHint: t('common:viewMoreDetails'),
      accessibilityRole: 'spinbutton',
    }

    if (phaseLessThanEqualToCurrent) {
      return (
        <Pressable {...pressableProps} {...testIdProps(`${heading} ${updatedLastDate}`)}>
          {data}
        </Pressable>
      )
    }

    return <Box {...testIdProps(heading)}>{data}</Box>
  }

  const numberOfRequests = numberOfItemsNeedingAttentionFromVet(eventsTimeline)

  return (
    <TextArea>
      {getPhaseData()}
      {expanded && (
        <Box mt={marginBetweenCards}>
          <TextView variant={'MobileBody'} selectable={true}>
            {getDetails(phase, t)}
          </TextView>
        </Box>
      )}
      {phase === 3 && needItemsFromVet(attributes) && (
        <Box mt={marginBetween}>
          <TextView variant={'MobileBodyBold'} selectable={true} accessibilityRole="header">
            {t(`claimPhase.youHaveFileRequest${numberOfRequests !== 1 ? 's' : ''}`, { numberOfRequests })}
          </TextView>
          <Box mt={marginBetween}>
            <VAButton
              onPress={navigateTo('ClaimFileUpload', {
                claimID,
                currentPhase: attributes.phase,
              })}
              testID={t('claimPhase.fileRequests.button.label')}
              label={t('claimPhase.fileRequests.button.label')}
              textColor={'primaryContrast'}
              backgroundColor={'button'}
              a11yHint={t('claimPhase.fileRequests.button.a11yHint')}
            />
          </Box>
        </Box>
      )}
    </TextArea>
  )
}

export default ClaimPhase
