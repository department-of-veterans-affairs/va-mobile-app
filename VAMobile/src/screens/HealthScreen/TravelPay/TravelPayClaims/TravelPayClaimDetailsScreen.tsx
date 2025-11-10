import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library'

import { useTravelPayClaimDetails } from 'api/travelPay'
import { Box, ErrorComponent, FeatureLandingTemplate, LinkWithAnalytics, LoadingComponent, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import TravelPayClaimAmount from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimAmount'
import TravelPayClaimAppeals from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimAppeals'
import TravelPayClaimDecisionReason from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimDecisionReason'
import TravelPayClaimHeader from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimHeader'
import TravelPayClaimInformation from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimInformation'
import TravelPayClaimStatusDefinition from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimStatusDefinition'
import TravelPayDocumentDownload from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayDocumentDownload'
import { ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const { LINK_URL_TRAVEL_PAY_SET_UP_DIRECT_DEPOSIT } = getEnv()
type TravelPayClaimDetailsScreenProps = StackScreenProps<HealthStackParamList, 'TravelPayClaimDetailsScreen'>

function TravelPayClaimDetailsScreen({ navigation, route }: TravelPayClaimDetailsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { claimId } = route.params

  // Create help button for FeatureLandingTemplate
  const helpIconProps: IconProps = {
    name: 'HelpOutline',
    fill: theme.colors.icon.active,
  }

  const headerButton = {
    label: t('help'),
    icon: helpIconProps,
    onPress: () => {
      navigateTo('TravelClaimHelpScreen', { fromClaimDetails: true })
    },
    testID: 'travelPayClaimDetailsHelpID',
  }

  const {
    data: claimDetailsData,
    error: claimDetailsError,
    isFetching: loadingClaimDetails,
    refetch: refetchClaimDetails,
  } = useTravelPayClaimDetails(claimId)
  const claimDetails = claimDetailsData?.data?.attributes
  const { appointmentDate, claimNumber, claimStatus, documents, decisionLetterReason, id } = claimDetails || {}

  return (
    <FeatureLandingTemplate
      backLabel={t('travelPay.title')}
      backLabelOnPress={navigation.goBack}
      title={t('travelPay.claimDetails.title')}
      testID="TravelPayClaimDetailsScreen"
      headerButton={headerButton}>
      {loadingClaimDetails ? (
        <LoadingComponent text={t('travelPay.claimDetails.loading')} />
      ) : claimDetailsError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.TRAVEL_PAY_CLAIM_DETAILS_SCREEN_ID}
          error={claimDetailsError}
          onTryAgain={refetchClaimDetails}
        />
      ) : (
        <Box borderTopWidth={1} borderTopColor={'divider'} backgroundColor={'list'}>
          <Box m={theme.dimensions.standardMarginBetween}>
            {claimDetails && (
              <>
                {/* Claim Header */}
                <TravelPayClaimHeader
                  appointmentDate={appointmentDate!}
                  claimNumber={claimNumber!}
                  claimStatus={claimStatus!}
                />

                {/* Status Definition */}
                <TravelPayClaimStatusDefinition claimStatus={claimStatus!} />

                {/* Decision Reason (for denied/partial payment claims) */}
                {decisionLetterReason && (claimStatus === 'Denied' || claimStatus === 'Claim paid') && (
                  <TravelPayClaimDecisionReason
                    claimStatus={claimStatus!}
                    decisionLetterReason={decisionLetterReason}
                  />
                )}

                {/* Decision Letter Download (for denied/partial payment claims) */}
                {documents && documents.length > 0 && (
                  <>
                    {documents
                      .filter(
                        (doc) => doc.filename.includes('Rejection Letter') || doc.filename.includes('Decision Letter'),
                      )
                      .map((doc) => (
                        <TravelPayDocumentDownload
                          key={doc.documentId}
                          document={doc}
                          linkText={t('travelPay.claimDetails.document.decisionLetter')}
                          claimId={id!}
                          claimStatus={claimStatus!}
                        />
                      ))}
                  </>
                )}

                {/* Amount Section */}
                <TravelPayClaimAmount claimDetails={claimDetails} />

                {/* Claim Information Section */}
                <TravelPayClaimInformation claimDetails={claimDetails} />

                {/* Direct Deposit Information Section */}
                {/* Gray divider - only show if there are documents */}
                {documents && documents.length < 0 && (
                  <Box
                    height={1}
                    borderTopWidth={1}
                    borderTopColor={'divider'}
                    mt={theme.dimensions.standardMarginBetween}
                  />
                )}
                <Box
                  testID="travelPayDirectDepositInfo"
                  mt={theme.dimensions.standardMarginBetween}
                  mb={theme.dimensions.standardMarginBetween}>
                  <TextView variant="MobileBodyBold" accessibilityRole="header">
                    {t('travelPay.claimDetails.directDeposit.title')}
                  </TextView>
                  <TextView variant="MobileBody">{t('travelPay.claimDetails.directDeposit.description')}</TextView>
                  <LinkWithAnalytics
                    type="url"
                    url={LINK_URL_TRAVEL_PAY_SET_UP_DIRECT_DEPOSIT}
                    text={t('travelPay.claimDetails.directDeposit.link.text')}
                    a11yLabel={a11yLabelVA(t('travelPay.claimDetails.directDeposit.link.text'))}
                    testID="travelPayDirectDepositLinkTestID"
                    icon="no icon"
                    disablePadding={true}
                  />
                </Box>

                {/* Appeals Section (only for denied claims) */}
                <TravelPayClaimAppeals claimDetails={claimDetails} />
              </>
            )}
          </Box>
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimDetailsScreen
