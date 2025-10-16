import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library'

import { useTravelPayClaimDetails } from 'api/travelPay'
import { Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import TravelPayClaimAmount from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimAmount'
import TravelPayClaimAppeals from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimAppeals'
import TravelPayClaimHeader from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimHeader'
import TravelPayClaimInformation from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimInformation'
import TravelPayClaimStatusDefinition from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimStatusDefinition'
import TravelPayDocumentDownload from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayDocumentDownload'
import { ScreenIDTypesConstants } from 'store/api/types'
import { useRouteNavigation, useTheme } from 'utils/hooks'

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

  if (loadingClaimDetails) {
    return (
      <FeatureLandingTemplate
        backLabel={t('travelPay.title')}
        backLabelOnPress={navigation.goBack}
        title={t('travelPay.claimDetails.title')}
        headerButton={headerButton}>
        <LoadingComponent text={t('travelPay.claimDetails.loading')} />
      </FeatureLandingTemplate>
    )
  }

  if (claimDetailsError) {
    return (
      <FeatureLandingTemplate
        backLabel={t('travelPay.title')}
        backLabelOnPress={navigation.goBack}
        title={t('travelPay.claimDetails.title')}
        testID="TravelPayClaimDetailsScreen"
        headerButton={headerButton}>
        <ErrorComponent
          screenID={ScreenIDTypesConstants.TRAVEL_PAY_CLAIM_DETAILS_SCREEN_ID}
          error={claimDetailsError}
          onTryAgain={refetchClaimDetails}
        />
      </FeatureLandingTemplate>
    )
  }

  if (!claimDetails) {
    return (
      <FeatureLandingTemplate
        backLabel={t('travelPay.title')}
        backLabelOnPress={navigation.goBack}
        title={t('travelPay.claimDetails.title')}
        testID="TravelPayClaimDetailsScreen"
        headerButton={headerButton}>
        <Box m={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('travelPay.claimDetails.noData')}
          </TextView>
        </Box>
      </FeatureLandingTemplate>
    )
  }

  const { appointmentDate, claimNumber, claimStatus, documents, id } = claimDetails

  return (
    <FeatureLandingTemplate
      backLabel={t('travelPay.title')}
      backLabelOnPress={navigation.goBack}
      title={t('travelPay.claimDetails.title')}
      testID="TravelPayClaimDetailsScreen"
      headerButton={headerButton}>
      <Box borderTopWidth={1} borderTopColor={'divider'} backgroundColor={'list'}>
        <Box m={theme.dimensions.standardMarginBetween}>
          {/* Claim Header */}
          <TravelPayClaimHeader appointmentDate={appointmentDate} claimNumber={claimNumber} claimStatus={claimStatus} />

          {/* Status Definition */}
          <TravelPayClaimStatusDefinition claimStatus={claimStatus} />

          {/* Decision Letter Download (for denied/partial payment claims) */}
          {documents && documents.length > 0 && (
            <>
              {documents
                .filter((doc) => doc.filename.includes('Rejection Letter') || doc.filename.includes('Decision Letter'))
                .map((doc) => (
                  <TravelPayDocumentDownload
                    key={doc.documentId}
                    document={doc}
                    linkText={t('travelPay.claimDetails.document.decisionLetter')}
                    claimId={id}
                  />
                ))}
            </>
          )}

          {/* Amount Section */}
          <TravelPayClaimAmount claimDetails={claimDetails} />

          {/* Claim Information Section */}
          <TravelPayClaimInformation claimDetails={claimDetails} />

          {/* Appeals Section (only for denied claims) */}
          <TravelPayClaimAppeals claimDetails={claimDetails} />
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimDetailsScreen
