import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, useRef } from 'react'

import { AuthorizedServicesState } from 'store/slices'
import { Box, ButtonTypesConstants, SimpleList, SimpleListItemObj, TextArea, TextView, VAButton } from 'components'
import { ClaimData } from 'store/api/types'
import { ClaimType, ClaimTypeConstants } from '../../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { featureEnabled } from 'utils/remoteConfig'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { logAnalyticsEvent } from 'utils/analytics'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import ClaimTimeline from './ClaimTimeline/ClaimTimeline'
import EstimatedDecisionDate from './EstimatedDecisionDate/EstimatedDecisionDate'
import NeedHelpData from 'screens/BenefitsScreen/ClaimsScreen/NeedHelpData/NeedHelpData'

/** props for the ClaimStatus component */
type ClaimStatusProps = {
  /** detailed claim information */
  claim: ClaimData
  /** indicates either open or closed claim */
  claimType: ClaimType
}

// TODO: ClaimType and ClaimTypeConstants need to be moved from ClaimsAndAppealsListView into a constants/claims file

/**
 * Component for rendering the details area of a claim when selected on the ClaimDetailsScreen
 */
const ClaimStatus: FC<ClaimStatusProps> = ({ claim, claimType }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { decisionLetters: decisionLettersAuthorized } = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)
  const sentEvent = useRef(false)

  const ActiveClaimStatusDetails = (): ReactElement => {
    // alternative check if need to update: isClosedClaim = claim.attributes.decisionLetterSent && !claim.attributes.open
    const isActiveClaim = claimType === ClaimTypeConstants.ACTIVE

    const whyWeCombineOnPress = () => {
      logAnalyticsEvent(Events.vama_claim_why_combine(claim.id, claim.attributes.claimType, claim.attributes.phase))
      navigateTo('ConsolidatedClaimsNote')()
    }

    const whatShouldOnPress = () => {
      logAnalyticsEvent(Events.vama_claim_disag(claim.id, claim.attributes.claimType, claim.attributes.phase))
      navigateTo('WhatDoIDoIfDisagreement', {
        claimID: claim.id,
        claimType: claim.attributes.claimType,
        claimStep: claim.attributes.phase,
      })()
    }

    if (isActiveClaim) {
      const detailsFAQListItems: Array<SimpleListItemObj> = [
        { text: t('claimDetails.whyWeCombine'), onPress: whyWeCombineOnPress, testId: t('claimDetails.whyWeCombine.a11yLabel') },
        { text: t('claimDetails.whatShouldIDoIfDisagree'), onPress: whatShouldOnPress, testId: t('claimDetails.whatShouldIDoIfDisagree.a11yLabel') },
      ]

      // TODO: determine when showCovidMessage prop for EstimatedDecisionDate would be false

      return (
        <Box mb={theme.dimensions.condensedMarginBetween}>
          {claim && <ClaimTimeline attributes={claim.attributes} claimID={claim.id} />}
          {false && <EstimatedDecisionDate maxEstDate={claim?.attributes?.maxEstDate} showCovidMessage={false} />}
          <Box>
            <SimpleList items={detailsFAQListItems} />
          </Box>
        </Box>
      )
    }

    return <></>
  }

  const ClosedClaimStatusDetails = (): ReactElement => {
    const isClosedClaim = claimType === ClaimTypeConstants.CLOSED

    if (isClosedClaim) {
      const completedEvent = claim?.attributes?.eventsTimeline.find((element) => element.type === 'completed')
      if (!completedEvent || !completedEvent.date) {
        return <></>
      }

      const onPress = () => {
        logAnalyticsEvent(Events.vama_ddl_status_click())
        navigateTo('ClaimLettersScreen')()
      }

      const claimDecidedOn = t('claimDetails.weDecidedYourClaimOn', { date: formatDateMMMMDDYYYY(completedEvent.date) })
      let letterAvailable = t('claimDetails.decisionLetterMailed')
      let showButton = false

      if (featureEnabled('decisionLettersWaygate') && decisionLettersAuthorized && claim.attributes.decisionLetterSent) {
        letterAvailable = t('claimDetails.youCanDownload')
        showButton = true
        if (!sentEvent.current) {
          logAnalyticsEvent(Events.vama_ddl_button_shown())
          sentEvent.current = true
        }
      }

      return (
        <Box mb={theme.dimensions.condensedMarginBetween}>
          <TextArea>
            <Box {...testIdProps(claimDecidedOn)} accessibilityRole="header" accessible={true}>
              <TextView variant="MobileBodyBold">{claimDecidedOn}</TextView>
            </Box>
            <Box {...testIdProps(letterAvailable)} accessible={true}>
              <TextView variant="MobileBody" paragraphSpacing={showButton ? true : false}>
                {letterAvailable}
              </TextView>
            </Box>
            {showButton && <VAButton onPress={onPress} label={t('claimDetails.getClaimLetters')} buttonType={ButtonTypesConstants.buttonPrimary} testID="getClaimLettersTestID" />}
          </TextArea>
        </Box>
      )
    }

    return <></>
  }

  return (
    <Box {...testIdProps('Your-claim: Status-tab-claim-details-page')}>
      <ActiveClaimStatusDetails />
      <ClosedClaimStatusDetails />
      <NeedHelpData claimId={claim.id} claimType={claim.attributes.claimType} claimPhase={claim.attributes.phase} />
    </Box>
  )
}

export default ClaimStatus
