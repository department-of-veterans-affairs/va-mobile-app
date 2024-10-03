import React, { RefObject, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { ClaimAttributesData } from 'api/types'
import { AccordionCollapsible, Box, LabelTag, LabelTagTypeConstants, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { getUserPhase, isDisabilityCompensationClaim, numberOfItemsNeedingAttentionFromVet } from 'utils/claims'
import { useAutoScrollToElement, useFontScale, useTheme } from 'utils/hooks'

/**
 * props for ClaimPhase components
 */
export type ClaimPhaseProps = {
  /** phase number of the current indicator */
  phase: number
  /** attributes object from ClaimData */
  attributes: ClaimAttributesData
  /** given claims ID */
  claimID: string
  /** enable autoScroll */
  scrollIsEnabled: boolean
  /** ref to parent scrollView, used for auto scroll */
  scrollViewRef: RefObject<ScrollView>
}

/**
 * Component for rendering each phase of a claim's lifetime.
 */
function ClaimPhase({ phase, attributes, claimID, scrollIsEnabled, scrollViewRef }: ClaimPhaseProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const [scrollRef, viewRef, scrollToCurrentPhase] = useAutoScrollToElement()
  const theme = useTheme()
  const fs = useFontScale()
  const { condensedMarginBetween, standardMarginBetween, tinyMarginBetween } = theme.dimensions

  const isDisabilityClaim = isDisabilityCompensationClaim(attributes.claimTypeCode)
  const translationStepString = isDisabilityClaim ? '8step' : '5step'
  const heading = t(`claimPhase.${translationStepString}.heading.phase${phase}`)

  const current = isDisabilityClaim ? attributes.phase : getUserPhase(attributes.phase)
  const isCompletedPhase = phase < current
  const isCurrentPhase = phase === current
  const isIncompletePhase = phase > current
  const hasFileRequests = numberOfItemsNeedingAttentionFromVet(attributes.eventsTimeline || []) > 0
  const disableScroll = !scrollIsEnabled || (hasFileRequests && !attributes?.waiverSubmitted)
  const indicatorDiameter = fs(30)

  useEffect(() => {
    if (phase > 1 && isCurrentPhase && scrollViewRef?.current && !disableScroll) {
      scrollRef.current = scrollViewRef.current
      scrollToCurrentPhase(-standardMarginBetween)
    }
  }, [phase, isCurrentPhase, scrollToCurrentPhase, scrollRef, scrollViewRef, standardMarginBetween, disableScroll])

  const phaseHeader = (
    <Box flexDirection="column">
      <Box flexDirection="row" alignItems="center" mb={isCompletedPhase ? tinyMarginBetween : 0}>
        {isCompletedPhase && (
          <Box
            justifyContent={'center'}
            alignItems={'center'}
            backgroundColor="completedPhase"
            borderWidth={2}
            borderRadius={indicatorDiameter > 30 ? 30 : indicatorDiameter}
            height={indicatorDiameter > 30 ? 30 : indicatorDiameter}
            width={indicatorDiameter > 30 ? 30 : indicatorDiameter}>
            <Icon width={18} height={18} name={'Check'} fill="#fff" preventScaling={true} />
          </Box>
        )}
        <TextView
          variant="MobileBodyBold"
          ml={isCompletedPhase ? condensedMarginBetween : 0}>{`Step ${phase}`}</TextView>
      </Box>
      <TextView>{heading}</TextView>
      {isCurrentPhase && (
        <Box mt={7}>
          <LabelTag text={t('currentStep')} labelType={LabelTagTypeConstants.tagGreen} />
        </Box>
      )}
    </Box>
  )

  const detailsText = t(`claimPhase.${translationStepString}.details.phase${phase}`)
  const phaseExpandedContent = (
    <TextView mt={standardMarginBetween} accessibilityLabel={a11yLabelVA(detailsText)}>
      {detailsText}
    </TextView>
  )

  const stepNumberA11y = t('stepXofY', { current: phase, total: isDisabilityClaim ? 8 : 5 })

  let currentStatusA11y = ''
  if (isIncompletePhase) {
    currentStatusA11y = t('incomplete')
  } else if (isCurrentPhase) {
    currentStatusA11y = t('currentStep')
  } else if (isCompletedPhase) {
    currentStatusA11y = t('complete')
  }

  let completedStepsA11y = ''
  if (phase === 2 && isCurrentPhase) {
    completedStepsA11y = t('claimPhase.heading.a11y.step1Complete')
  } else if (phase > 2 && isCurrentPhase) {
    completedStepsA11y = t('claimPhase.heading.a11y.stepCompleteRange', { lastStep: current - 1 })
  }

  let testID = `${stepNumberA11y}. ${heading}. ${currentStatusA11y}.`
  if (completedStepsA11y) {
    testID += ` ${completedStepsA11y}.`
  }

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

  return (
    <AccordionCollapsible
      noBorder={true}
      header={phaseHeader}
      expandedContent={phaseExpandedContent}
      expandedInitialValue={isCurrentPhase}
      customOnPress={accordionPress}
      headerRef={viewRef}
      testID={testID}
    />
  )
}

export default ClaimPhase
