import React, { ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import { ClaimAttributesData, ClaimEventData } from 'api/types'
import { AccordionCollapsible, Box, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { groupTimelineActivity, needItemsFromVet, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { sortByDate } from 'utils/common'
import { useRouteNavigation, useTheme } from 'utils/hooks'

import PhaseIndicator from './PhaseIndicator'

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
  return lastUpdate
    ? DateTime.fromISO(lastUpdate).toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' })
    : ''
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
function DEPRECATED_ClaimPhase({ phase, current, attributes, claimID }: ClaimPhaseProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { condensedMarginBetween, standardMarginBetween } = theme.dimensions
  const { eventsTimeline } = attributes

  const phaseLessThanEqualToCurrent = phase <= current
  const heading = t(`claimPhase.5step.heading.phase${phase}`)
  const updatedLastDate = phaseLessThanEqualToCurrent ? updatedLast(eventsTimeline, phase) : ''
  const showClaimFileUploadBtn = needItemsFromVet(attributes) && !attributes.waiverSubmitted

  useEffect(() => {
    if (phase === 3 && current === 3 && showClaimFileUploadBtn) {
      logAnalyticsEvent(Events.vama_claim_file_request(claimID))
    }
  }, [phase, current, showClaimFileUploadBtn, claimID])

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
      <Box mt={condensedMarginBetween}>
        <TextView accessibilityLabel={detailsA11yLabel} variant={'MobileBody'}>
          {detailsText}
        </TextView>
      </Box>
    )
  }

  let status = ''

  if (phase === current) {
    status = t('claimPhase.heading.a11y.current')
  } else if (phase < current) {
    status = t('claimPhase.heading.a11y.completed')
  }

  let testID = `${t('claimPhase.heading.a11y.stepOf5', { step: phase })} ${status} ${heading}`

  if (phaseLessThanEqualToCurrent) {
    testID = `${testID} ${updatedLastDate}`
  }

  const count = numberOfItemsNeedingAttentionFromVet(eventsTimeline)

  const detailsText = t(`claimPhase.5step.details.phase${phase}`)
  const detailsA11yLabel = phase === 1 ? a11yLabelVA(t('claimPhase.5step.details.phase1')) : detailsText
  const youHaveFileRequestsText = t('claimPhase.youHaveFileRequest', { count })

  const accordionPress = (isExpanded: boolean | undefined) => {
    logAnalyticsEvent(
      Events.vama_claim_details_exp(
        claimID,
        attributes.claimType,
        phase,
        isExpanded || false,
        attributes.phaseChangeDate || '',
        attributes.dateFiled,
        attributes.phase,
      ),
    )
  }

  const fileRequestsPress = () => {
    logAnalyticsEvent(Events.vama_claim_review(claimID, attributes.claimType, count))
    navigateTo('FileRequest', { claimID, undefined })
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
          <TextView
            variant={'MobileBodyBold'}
            accessibilityLabel={a11yLabelVA(youHaveFileRequestsText)}
            accessibilityRole="header"
            accessible={true}>
            {youHaveFileRequestsText}
          </TextView>
          <Box mt={standardMarginBetween}>
            <Button
              onPress={fileRequestsPress}
              testID={t('claimPhase.fileRequests.button.label')}
              label={t('claimPhase.fileRequests.button.label')}
              a11yHint={t('claimPhase.fileRequests.button.a11yHint')}
            />
          </Box>
        </Box>
      )}
    </AccordionCollapsible>
  )
}

export default DEPRECATED_ClaimPhase
