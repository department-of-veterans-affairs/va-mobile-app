import React, { FC, ReactNode, useEffect } from 'react'

import { DateTime } from 'luxon'
import { TFunction } from 'i18next'

import { AccordionCollapsible, Box, ButtonTypesConstants, TextView, VAButton } from 'components'
import { ClaimAttributesData, ClaimEventData } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { groupTimelineActivity, needItemsFromVet, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { sendClaimStep3Analytics, sendClaimStep3FileRequestAnalytics } from 'store'
import { sortByDate } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useDispatch } from 'react-redux'
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
  const currentPhase = (phases[`${phase}`] as unknown as Array<{ [key: string]: string }>) || []
  sortByDate(currentPhase, 'date', true)

  const lastUpdate = currentPhase.length > 0 && currentPhase[0]?.date
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
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()
  const { condensedMarginBetween, standardMarginBetween } = theme.dimensions
  const { eventsTimeline } = attributes

  const phaseLessThanEqualToCurrent = phase <= current
  const heading = getHeading(phase, t)
  const updatedLastDate = phaseLessThanEqualToCurrent ? updatedLast(eventsTimeline, phase) : ''
  const showClaimFileUploadBtn = needItemsFromVet(attributes) && !attributes.waiverSubmitted

  useEffect(() => {
    if (phase === 3 && current === 3) {
      dispatch(sendClaimStep3Analytics())
    }
  }, [dispatch, phase, current])

  useEffect(() => {
    if (phase === 3 && current === 3 && showClaimFileUploadBtn) {
      dispatch(sendClaimStep3FileRequestAnalytics())
    }
  }, [dispatch, phase, current, showClaimFileUploadBtn])

  const getPhaseHeader = (): ReactNode => {
    return (
      <Box flexDirection={'row'}>
        <PhaseIndicator phase={phase} current={current} />
        <Box flexDirection={'column'} justifyContent={'flex-start'} flex={1}>
          <TextView variant={'MobileBodyBold'} selectable={!phaseLessThanEqualToCurrent}>
            {heading}
          </TextView>
          {phaseLessThanEqualToCurrent && <TextView variant={'MobileBody'}>{updatedLastDate}</TextView>}
        </Box>
      </Box>
    )
  }

  const getPhaseExpandedContent = (): ReactNode => {
    return (
      <Box mt={condensedMarginBetween} {...testIdProps(detailsA11yLabel)} accessible={true}>
        <TextView variant={'MobileBody'}>{detailsText}</TextView>
      </Box>
    )
  }

  const testID = phaseLessThanEqualToCurrent ? `${heading} ${updatedLastDate}` : heading
  const numberOfRequests = numberOfItemsNeedingAttentionFromVet(eventsTimeline)

  const detailsText = getDetails(phase, t)
  const detailsA11yLabel = phase === 1 ? t('claimPhase.details.phaseOneA11yLabel') : detailsText
  const youHaveFileRequestsText = t(`claimPhase.youHaveFileRequest${numberOfRequests !== 1 ? 's' : ''}`, { numberOfRequests })
  const youHaveFileRequestsTextA11yHint = t(`claimPhase.youHaveFileRequest${numberOfRequests !== 1 ? 's' : ''}A11yHint`, { numberOfRequests })

  return (
    <AccordionCollapsible noBorder={true} header={getPhaseHeader()} expandedContent={getPhaseExpandedContent()} hideArrow={!phaseLessThanEqualToCurrent} testID={testID}>
      {phase === 3 && showClaimFileUploadBtn && (
        <Box mt={standardMarginBetween}>
          <Box {...testIdProps(youHaveFileRequestsTextA11yHint)} accessible={true} accessibilityRole="header">
            <TextView variant={'MobileBodyBold'}>{youHaveFileRequestsText}</TextView>
          </Box>
          <Box mt={standardMarginBetween}>
            <VAButton
              onPress={navigateTo('ClaimFileUpload', { claimID })}
              testID={t('claimPhase.fileRequests.button.label')}
              label={t('claimPhase.fileRequests.button.label')}
              buttonType={ButtonTypesConstants.buttonPrimary}
              a11yHint={t('claimPhase.fileRequests.button.a11yHint')}
            />
          </Box>
        </Box>
      )}
    </AccordionCollapsible>
  )
}

export default ClaimPhase
