import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { IconProps, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { useDownloadTravelPayDocument, useTravelPayClaimDetails } from 'api/travelPay'
import {
  Box,
  DefaultList,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  TextView,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import {
  TravelPayClaimAmount,
  TravelPayClaimDecisionReason,
  TravelPayClaimHeader,
  TravelPayClaimInformation,
  TravelPayClaimStatusDefinition,
} from 'screens/HealthScreen/TravelPay/TravelPayClaims/Details'
import { ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { isErrorObject } from 'utils/common'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { createTravelPayDocumentListItem } from 'utils/travelPay'

const { LINK_URL_TRAVEL_PAY_SET_UP_DIRECT_DEPOSIT } = getEnv()
type TravelPayClaimDetailsScreenProps = StackScreenProps<HealthStackParamList, 'TravelPayClaimDetailsScreen'>

function TravelPayClaimDetailsScreen({ navigation, route }: TravelPayClaimDetailsScreenProps) {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { claimId } = route.params
  const [documentIdToDownload, setDocumentIdToDownload] = useState<string>('')
  const [documentFilename, setDocumentFilename] = useState<string>('')
  const [isDecisionLetter, setIsDecisionLetter] = useState<boolean>(false)

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
  const isDownloadEnabled = documentIdToDownload.length > 0 && documentFilename.length > 0

  const {
    isFetching: downloading,
    error: downloadDocumentError,
    refetch: refetchDocument,
  } = useDownloadTravelPayDocument(claimId, documentIdToDownload, documentFilename, {
    enabled: isDownloadEnabled,
  })

  const hasError = claimDetailsError || (!loadingClaimDetails && !claimDetails)

  // Show error snackbar when document download fails
  useEffect(() => {
    if (downloadDocumentError && isErrorObject(downloadDocumentError)) {
      snackbar.show(t('travelPay.claimDetails.document.downloadError'), {
        isError: true,
        onActionPressed: refetchDocument,
      })
    }
  }, [downloadDocumentError, t, refetchDocument, snackbar])

  // Reset download state when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setDocumentIdToDownload('')
      setDocumentFilename('')
      setIsDecisionLetter(false)
    }, []),
  )

  // Handler for document downloads
  const handleDocumentDownload = (documentId: string, filename: string, isDecisionLetterDoc: boolean = false) => {
    setIsDecisionLetter(isDecisionLetterDoc)

    if (documentId === documentIdToDownload) {
      // Re-download if same document clicked again
      setDocumentIdToDownload('')
      setDocumentFilename('')
      setTimeout(() => {
        setDocumentIdToDownload(documentId)
        setDocumentFilename(filename)
      }, 0)
    } else {
      setDocumentIdToDownload(documentId)
      setDocumentFilename(filename)
    }
  }

  // Renders the decision document section if applicable
  const renderDecisionDocuments = () => {
    if (!documents || documents.length === 0) return null

    const decisionLetterDocs = documents.filter(
      (doc) => doc.filename.includes('Rejection Letter') || doc.filename.includes('Decision Letter'),
    )

    if (decisionLetterDocs.length === 0) return null

    return (
      <Box mx={-theme.dimensions.gutter}>
        <DefaultList
          items={decisionLetterDocs.map((doc) =>
            createTravelPayDocumentListItem(
              doc,
              id!,
              claimStatus!,
              (docId, filename) => handleDocumentDownload(docId, filename, true),
              theme,
              t,
              t('travelPay.claimDetails.document.decisionLetter'),
              true, // isDecisionLetter - bold font + icon
            ),
          )}
        />
      </Box>
    )
  }

  return (
    <FeatureLandingTemplate
      backLabelOnPress={navigation.goBack}
      backLabelTestID="travelClaimDetailBackButtonID"
      title={t('travelPay.claimDetails.title')}
      testID="TravelPayClaimDetailsScreen"
      headerButton={headerButton}>
      {loadingClaimDetails || downloading ? (
        <LoadingComponent
          text={t(
            downloading
              ? isDecisionLetter
                ? 'travelPay.claimDetails.document.loadingDecisionLetter'
                : 'travelPay.claimDetails.document.loading'
              : 'travelPay.claimDetails.loading',
          )}
        />
      ) : hasError ? (
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
                {renderDecisionDocuments()}

                {/* Amount Section */}
                <TravelPayClaimAmount claimDetails={claimDetails} />

                {/* Claim Information Section */}
                <TravelPayClaimInformation claimDetails={claimDetails} onDocumentPress={handleDocumentDownload} />

                {/* Direct Deposit Information Section */}
                {/* Gray divider - only show if there are no documents */}
                {!documents?.length && (
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
              </>
            )}
          </Box>
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimDetailsScreen
