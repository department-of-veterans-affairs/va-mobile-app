import React, { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useDecisionLetters } from 'api/decisionLetters'
import { ClaimData } from 'api/types'
import { Box, TextArea, TextView, VABulletList } from 'components'
import { ClaimType, ClaimTypeConstants } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { featureEnabled } from 'utils/remoteConfig'

import ClaimTimeline from './ClaimTimeline/ClaimTimeline'
import ClosedClaimStatusDetails from './ClosedClaimInfo/ClosedClaimStatusDetails'
import EstimatedDecisionDate from './EstimatedDecisionDate/EstimatedDecisionDate'

/** props for the ClaimStatus component */
type ClaimStatusProps = {
  /** detailed claim information */
  claim: ClaimData
  /** indicates either open or closed claim */
  claimType: ClaimType
  /** enable autoScroll */
  scrollIsEnabled: boolean
  /** ref to parent scrollView, used for auto scroll */
  scrollViewRef: RefObject<ScrollView>
}

/**
 * Component for rendering the details area of a claim when selected on the ClaimDetailsScreen
 */
function ClaimStatus({ claim, claimType, scrollIsEnabled, scrollViewRef }: ClaimStatusProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: decisionLetterData } = useDecisionLetters()

  const letterIsDownloadable = Boolean(
    featureEnabled('decisionLettersWaygate') &&
      userAuthorizedServices?.decisionLetters &&
      claim.attributes.decisionLetterSent &&
      (decisionLetterData?.data.length || 0) > 0,
  )

  function renderActiveClaimStatusDetails() {
    // alternative check if need to update: isClosedClaim = claim.attributes.decisionLetterSent && !claim.attributes.open
    const isActiveClaim = claimType === ClaimTypeConstants.ACTIVE

    if (isActiveClaim) {
      // TODO: determine when showCovidMessage prop for EstimatedDecisionDate would be false

      return (
        <Box>
          {claim && (
            <ClaimTimeline
              attributes={claim.attributes}
              claimID={claim.id}
              scrollIsEnabled={scrollIsEnabled}
              scrollViewRef={scrollViewRef}
            />
          )}
          {false && <EstimatedDecisionDate maxEstDate={claim?.attributes?.maxEstDate} showCovidMessage={false} />}
          <TextArea>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {t('claimDetails.whatYouHaveClaimed')}
            </TextView>
            {claim.attributes.contentionList && claim.attributes.contentionList.length > 0 ? (
              <VABulletList listOfText={claim.attributes.contentionList} />
            ) : (
              <TextView variant="MobileBody">{t('noneNoted')}</TextView>
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
      <ClosedClaimStatusDetails claim={claim} claimType={claimType} letterIsDownloadable={letterIsDownloadable} />
    </Box>
  )
}

export default ClaimStatus
