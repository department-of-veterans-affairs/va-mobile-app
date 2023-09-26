import { DateTime } from 'luxon'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useEffect } from 'react'

import { AccordionCollapsible, Box, ButtonTypesConstants, TextView, VAButton } from 'components'
import { ClaimAttributesData, ClaimEventData } from 'store/api'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { groupTimelineActivity, needItemsFromVet, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { logAnalyticsEvent } from 'utils/analytics'
import { sendClaimStep3FileRequestAnalytics } from 'store/slices/claimsAndAppealsSlice'
import { sortByDate } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
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
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const { condensedMarginBetween, standardMarginBetween } = theme.dimensions
  const { eventsTimeline } = attributes

  const phaseLessThanEqualToCurrent = phase <= current
  const heading = getHeading(phase, t)
  const updatedLastDate = phaseLessThanEqualToCurrent ? updatedLast(eventsTimeline, phase) : ''
  const showClaimFileUploadBtn = needItemsFromVet(attributes) && !attributes.waiverSubmitted

  useEffect(() => {
    if (phase === 3 && current === 3 && showClaimFileUploadBtn) {
      dispatch(sendClaimStep3FileRequestAnalytics())
    }
  }, [dispatch, phase, current, showClaimFileUploadBtn])

  const getPhaseHeader = (): ReactNode => {
    return (
      <Box flexDirection={'row'} importantForAccessibility={'no-hide-descendants'}>
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

  let status = ''

  if (phase === current) {
    status = t('claimPhase.heading.a11y.current')
  } else if (phase < current) {
    status = t('claimPhase.heading.a11y.completed')
  }

  let testID = `${t('claimPhase.heading.a11y.step', { step: phase })} ${status} ${heading}`

  if (phaseLessThanEqualToCurrent) {
    testID = `${testID} ${updatedLastDate}`
  }

  const count = numberOfItemsNeedingAttentionFromVet(eventsTimeline)

  const detailsText = getDetails(phase, t)
  const detailsA11yLabel = phase === 1 ? a11yLabelVA(t('claimPhase.details.phaseOne')) : detailsText
  const youHaveFileRequestsText = t('claimPhase.youHaveFileRequest', { count })

  const accordionPress = (isExpanded: boolean | undefined) => {
    logAnalyticsEvent(Events.vama_claim_details_exp(claimID, attributes.claimType, phase, isExpanded || false, attributes.phaseChangeDate || '', attributes.dateFiled))
  }

  const fileRequestsPress = () => {
    logAnalyticsEvent(Events.vama_claim_review(claimID, attributes.claimType, count))
    navigateTo('FileRequest', { claimID })()
  }

  return (
    <AccordionCollapsible
      noBorder={true}
      header={getPhaseHeader()}
      expandedContent={getPhaseExpandedContent()}
      hideArrow={!phaseLessThanEqualToCurrent}
      customOnPress={accordionPress}
      testID={testID}>
      {phase === 3 && showClaimFileUploadBtn && (
        <Box mt={standardMarginBetween}>
          <TextView variant={'MobileBodyBold'} accessibilityLabel={a11yLabelVA(youHaveFileRequestsText)} accessibilityRole="header" accessible={true}>
            {youHaveFileRequestsText}
          </TextView>
          <Box mt={standardMarginBetween}>
            <VAButton
              onPress={fileRequestsPress}
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
