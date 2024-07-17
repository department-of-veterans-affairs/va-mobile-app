import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useDecisionLetters } from 'api/decisionLetters'
import { ClaimData } from 'api/types'
import { Box, TextArea, TextView, VABulletList } from 'components'
import { Events } from 'constants/analytics'
import { ClaimType, ClaimTypeConstants } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
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
}

/**
 * Component for rendering the details area of a claim when selected on the ClaimDetailsScreen
 */
function ClaimStatus({ claim, claimType }: ClaimStatusProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: decisionLetterData } = useDecisionLetters()
  const sentEvent = useRef(false)

  function renderActiveClaimStatusDetails() {
    // alternative check if need to update: isClosedClaim = claim.attributes.decisionLetterSent && !claim.attributes.open
    const isActiveClaim = claimType === ClaimTypeConstants.ACTIVE

    if (isActiveClaim) {
      // TODO: determine when showCovidMessage prop for EstimatedDecisionDate would be false

      return (
        <Box>
          {claim && <ClaimTimeline attributes={claim.attributes} claimID={claim.id} />}
          {false && <EstimatedDecisionDate maxEstDate={claim?.attributes?.maxEstDate} showCovidMessage={false} />}
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('claimDetails.whatYouHaveClaimed')}
            </TextView>
            {claim.attributes.contentionList && claim.attributes.contentionList.length > 0 ? (
              <VABulletList listOfText={claim.attributes.contentionList} />
            ) : (
              <TextView variant="MobileBody" paragraphSpacing={true}>
                {t('noneNoted')}
              </TextView>
            )}
          </TextArea>
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
