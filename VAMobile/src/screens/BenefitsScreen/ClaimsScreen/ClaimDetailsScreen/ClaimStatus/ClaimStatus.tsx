import React, { RefObject, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useDecisionLetters } from 'api/decisionLetters'
import { ClaimData } from 'api/types'
import { Box, SimpleList, SimpleListItemObj, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { ClaimType, ClaimTypeConstants } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useRouteNavigation } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

import ClaimTimeline from './ClaimTimeline/ClaimTimeline'
import EstimatedDecisionDate from './EstimatedDecisionDate/EstimatedDecisionDate'

/** props for the ClaimStatus component */
type ClaimStatusProps = {
  /** detailed claim information */
  claim: ClaimData
  /** indicates either open or closed claim */
  claimType: ClaimType
  /** ref to parent scrollView, used for auto scroll */
  scrollViewRef: RefObject<ScrollView>
}

/**
 * Component for rendering the details area of a claim when selected on the ClaimDetailsScreen
 */
function ClaimStatus({ claim, claimType, scrollViewRef }: ClaimStatusProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: decisionLetterData } = useDecisionLetters()
  const sentEvent = useRef(false)

  function renderActiveClaimStatusDetails() {
    // alternative check if need to update: isClosedClaim = claim.attributes.decisionLetterSent && !claim.attributes.open
    const isActiveClaim = claimType === ClaimTypeConstants.ACTIVE

    const whyWeCombineOnPress = () => {
      logAnalyticsEvent(Events.vama_claim_why_combine(claim.id, claim.attributes.claimType, claim.attributes.phase))
      navigateTo('ConsolidatedClaimsNote')
    }

    const whatShouldOnPress = () => {
      logAnalyticsEvent(Events.vama_claim_disag(claim.id, claim.attributes.claimType, claim.attributes.phase))
      navigateTo('WhatDoIDoIfDisagreement', {
        claimID: claim.id,
        claimType: claim.attributes.claimType,
        claimStep: claim.attributes.phase,
      })
    }

    if (isActiveClaim) {
      const detailsFAQListItems: Array<SimpleListItemObj> = [
        {
          text: t('claimDetails.whyWeCombine'),
          onPress: whyWeCombineOnPress,
          testId: a11yLabelVA(t('claimDetails.whyWeCombine')),
        },
        {
          text: t('claimDetails.whatShouldIDoIfDisagree'),
          onPress: whatShouldOnPress,
          testId: a11yLabelVA(t('claimDetails.whatShouldIDoIfDisagree')),
        },
      ]

      // TODO: determine when showCovidMessage prop for EstimatedDecisionDate would be false

      return (
        <Box>
          {claim && <ClaimTimeline attributes={claim.attributes} claimID={claim.id} scrollViewRef={scrollViewRef} />}
          {false && <EstimatedDecisionDate maxEstDate={claim?.attributes?.maxEstDate} showCovidMessage={false} />}
          <Box>
            <SimpleList items={detailsFAQListItems} />
          </Box>
        </Box>
      )
    }

    return <></>
  }

  function renderClosedClaimStatusDetails() {
    const isClosedClaim = claimType === ClaimTypeConstants.CLOSED

    if (isClosedClaim) {
      const completedEvent = claim?.attributes?.eventsTimeline.find((element) => element.type === 'completed')
      if (!completedEvent || !completedEvent.date) {
        return <></>
      }

      const onPress = () => {
        logAnalyticsEvent(Events.vama_ddl_status_click())
        navigateTo('ClaimLettersScreen')
      }

      const claimDecidedOn = t('claimDetails.weDecidedYourClaimOn', { date: formatDateMMMMDDYYYY(completedEvent.date) })
      let letterAvailable = t('claimDetails.decisionLetterMailed')
      let showButton = false

      if (
        featureEnabled('decisionLettersWaygate') &&
        userAuthorizedServices?.decisionLetters &&
        claim.attributes.decisionLetterSent &&
        (decisionLetterData?.data.length || 0) > 0
      ) {
        letterAvailable = t('claimDetails.youCanDownload')
        showButton = true
        if (!sentEvent.current) {
          logAnalyticsEvent(Events.vama_ddl_button_shown())
          sentEvent.current = true
        }
      }

      return (
        <Box>
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header" accessible={true}>
              {claimDecidedOn}
            </TextView>
            <TextView variant="MobileBody" accessible={true} paragraphSpacing={showButton}>
              {letterAvailable}
            </TextView>
            {showButton && (
              <Button onPress={onPress} label={t('claimDetails.getClaimLetters')} testID="getClaimLettersTestID" />
            )}
          </TextArea>
        </Box>
      )
    }

    return <></>
  }

  return (
    <Box testID="claimStatusDetailsID">
      {renderActiveClaimStatusDetails()}
      {renderClosedClaimStatusDetails()}
    </Box>
  )
}

export default ClaimStatus
