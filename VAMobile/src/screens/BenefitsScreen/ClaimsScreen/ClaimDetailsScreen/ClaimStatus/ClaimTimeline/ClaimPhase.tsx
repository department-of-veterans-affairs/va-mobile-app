import React from 'react'
import { useTranslation } from 'react-i18next'

import { ClaimAttributesData } from 'api/types'
import { AccordionCollapsible, Box, LabelTag, LabelTagTypeConstants, TextView, VAIcon } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'

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
function ClaimPhase({ phase, current, attributes, claimID }: ClaimPhaseProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { condensedMarginBetween, standardMarginBetween } = theme.dimensions

  const isCompleted = phase < current
  const isCurrent = phase === current
  /*************** NOTE: Need to determine if type is disability. How?  *********************/
  const isDisabilityClaim = true
  const translationStepString = isDisabilityClaim ? '8step' : '5step'
  const heading = t(`claimPhase.${translationStepString}.heading.phase${phase}`)

  const phaseHeader = (
    <Box flexDirection="column">
      <Box flexDirection="row" alignItems="center" mb={condensedMarginBetween}>
        {isCompleted && <VAIcon name="CircleCheckMark" fill={theme.colors.icon.success} width={24} height={24} />}
        <TextView variant="MobileBodyBold" ml={isCompleted ? condensedMarginBetween : 0}>{`Step ${phase}`}</TextView>
      </Box>
      <TextView>{heading}</TextView>
      {isCurrent && (
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

  let status = ''

  if (isCurrent) {
    status = t('claimPhase.heading.a11y.current')
  } else if (isCompleted) {
    status = t('claimPhase.heading.a11y.completed')
  }

  const testID = `${t('claimPhase.heading.a11y.step', { step: phase })} ${status} ${heading}`

  const accordionPress = (isExpanded: boolean | undefined) => {
    logAnalyticsEvent(
      Events.vama_claim_details_exp(
        claimID,
        attributes.claimType,
        phase,
        isExpanded || false,
        attributes.phaseChangeDate || '',
        attributes.dateFiled,
      ),
    )
  }

  return (
    <AccordionCollapsible
      noBorder={true}
      header={phaseHeader}
      expandedContent={phaseExpandedContent}
      expandedInitialValue={isCurrent}
      customOnPress={accordionPress}
      testID={testID}
    />
  )
}

export default ClaimPhase
