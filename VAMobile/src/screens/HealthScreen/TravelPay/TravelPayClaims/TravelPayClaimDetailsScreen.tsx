import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useTravelPayClaimDetails } from 'api/travelPay'
import { Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type TravelPayClaimDetailsScreenProps = StackScreenProps<HealthStackParamList, 'TravelPayClaimDetailsScreen'>

function TravelPayClaimDetailsScreen({ navigation, route }: TravelPayClaimDetailsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { claimId } = route.params

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
        title={t('travelPay.claimDetails.title')}>
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
        testID="TravelPayClaimDetailsScreen">
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
        testID="TravelPayClaimDetailsScreen">
        <Box m={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('travelPay.claimDetails.noData')}
          </TextView>
        </Box>
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('travelPay.title')}
      backLabelOnPress={navigation.goBack}
      title={t('travelPay.claimDetails.title')}
      testID="TravelPayClaimDetailsScreen">
      <Box m={theme.dimensions.standardMarginBetween}>
        {/* Claim Header */}
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            Claim number: {claimDetails.claimNumber}
          </TextView>
          <TextView variant="MobileBody" color="bodyText" mt={theme.dimensions.condensedMarginBetween}>
            {claimDetails.claimName}
          </TextView>
          <TextView variant="MobileBodyBold" color="bodyText" mt={theme.dimensions.condensedMarginBetween}>
            Claim status: {claimDetails.claimStatus}
          </TextView>
        </Box>

        {/* Claimant Information */}
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" mb={theme.dimensions.condensedMarginBetween}>
            Claimant
          </TextView>
          <TextView variant="MobileBody">
            {claimDetails.claimantFirstName} {claimDetails.claimantMiddleName} {claimDetails.claimantLastName}
          </TextView>
        </Box>

        {/* Appointment Information */}
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" mb={theme.dimensions.condensedMarginBetween}>
            Appointment Information
          </TextView>
          <TextView variant="MobileBody">Date: {formatDateMMMMDDYYYY(claimDetails.appointmentDate)}</TextView>
          <TextView variant="MobileBody">Facility: {claimDetails.facilityName}</TextView>
          {claimDetails.appointment && (
            <>
              <TextView variant="MobileBody">Appointment Type: {claimDetails.appointment.appointmentType}</TextView>
              <TextView variant="MobileBody">Status: {claimDetails.appointment.appointmentStatus}</TextView>
            </>
          )}
        </Box>

        {/* Financial Details */}
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" mb={theme.dimensions.condensedMarginBetween}>
            Financial Summary
          </TextView>
          <TextView variant="MobileBody">Total Requested: ${claimDetails.totalCostRequested.toFixed(2)}</TextView>
          <TextView variant="MobileBody">Reimbursement Amount: ${claimDetails.reimbursementAmount.toFixed(2)}</TextView>
        </Box>

        {/* Expenses */}
        {claimDetails.expenses && claimDetails.expenses.length > 0 && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBodyBold" mb={theme.dimensions.condensedMarginBetween}>
              Expenses
            </TextView>
            {claimDetails.expenses.map((expense) => (
              <Box key={expense.id} mb={theme.dimensions.condensedMarginBetween}>
                <TextView variant="MobileBody">
                  {expense.name} ({expense.expenseType})
                </TextView>
                <TextView variant="MobileBody" color="bodyText">
                  {expense.description}
                </TextView>
                <TextView variant="MobileBody">
                  Requested: ${expense.costRequested.toFixed(2)} | Submitted: ${expense.costSubmitted.toFixed(2)}
                </TextView>
              </Box>
            ))}
          </Box>
        )}

        {/* Documents */}
        {claimDetails.documents && claimDetails.documents.length > 0 && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBodyBold" mb={theme.dimensions.condensedMarginBetween}>
              Documents ({claimDetails.documents.length})
            </TextView>
            {claimDetails.documents.map((document) => (
              <TextView key={document.documentId} variant="MobileBody">
                • {document.filename}
              </TextView>
            ))}
          </Box>
        )}

        {/* Rejection Reason (if present) */}
        {claimDetails.rejectionReason && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBodyBold" mb={theme.dimensions.condensedMarginBetween}>
              Rejection Information
            </TextView>
            <TextView variant="MobileBody">Reason: {claimDetails.rejectionReason.rejectionReasonTitle}</TextView>
            <TextView variant="MobileBody" color="bodyText">
              {claimDetails.rejectionReason.rejectionReasonDescription}
            </TextView>
          </Box>
        )}

        {/* Claim Dates */}
        <Box mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" mb={theme.dimensions.condensedMarginBetween}>
            Claim History
          </TextView>
          <TextView variant="MobileBody">Created: {formatDateMMMMDDYYYY(claimDetails.createdOn)}</TextView>
          <TextView variant="MobileBody">Last Modified: {formatDateMMMMDDYYYY(claimDetails.modifiedOn)}</TextView>
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default TravelPayClaimDetailsScreen
