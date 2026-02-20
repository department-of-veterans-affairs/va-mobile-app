import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useRoute } from '@react-navigation/native'

import { QueryClient, useQueryClient } from '@tanstack/react-query'

import { appointmentsKeys } from 'api/appointments'
import { useMaintenanceWindows } from 'api/maintenanceWindows/getMaintenanceWindows'
import { AppointmentAttributes, AppointmentsGetData } from 'api/types'
import { AlertWithHaptics, Box, LinkWithAnalytics, TextAreaSpacer, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { CONNECTION_STATUS } from 'constants/offline'
import { TravelPayHelp } from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/components'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import {
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  getDaysLeftToFileTravelPay,
  isEligibleForTravelPay,
} from 'utils/appointments'
import { formatDateTimeReadable } from 'utils/formattingUtils'
import { useDowntime, useOfflineSnackbar, useRouteNavigation, useTheme } from 'utils/hooks'
import { useAppIsOnline } from 'utils/hooks/offline'
import { navigateToTravelClaims, useTravelClaimSubmissionMutationState } from 'utils/travelPay'

type TravelClaimFiledDetailsProps = {
  appointmentID: string
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
}

export const getCachedAppointmentById = (queryClient: QueryClient, appointmentID: string) => {
  const appointmentQueries = queryClient.getQueriesData<AppointmentsGetData>({
    queryKey: [appointmentsKeys.appointments],
  })

  for (const [, queryData] of appointmentQueries) {
    if (queryData?.data) {
      const found = queryData.data.find((appt) => appt.id === appointmentID)
      if (found) {
        return found
      }
    }
  }

  return null
}

function AppointmentTravelClaimDetails({ appointmentID, attributes, subType }: TravelClaimFiledDetailsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const queryClient = useQueryClient()
  const route = useRoute()
  const connectionStatus = useAppIsOnline()
  const showOfflineSnackbar = useOfflineSnackbar()

  const travelPayInDowntime = useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures)
  const { maintenanceWindows } = useMaintenanceWindows()
  const endTime = formatDateTimeReadable(maintenanceWindows?.[DowntimeFeatureTypeConstants.travelPayFeatures]?.endTime)

  const mutationState = useTravelClaimSubmissionMutationState(appointmentID)
  const isSubmitting = mutationState?.status === 'pending'

  const appointment = useMemo(() => {
    return getCachedAppointmentById(queryClient, appointmentID)
  }, [appointmentID, queryClient])

  const appointmentLookupError = !appointment

  const goToTravelClaims = () => {
    if (connectionStatus === CONNECTION_STATUS.DISCONNECTED) {
      showOfflineSnackbar()
      return
    }

    navigateToTravelClaims(navigateTo)
  }

  const getContent = () => {
    // When travel pay is in downtime, display a downtime message
    if (travelPayInDowntime) {
      return (
        <>
          <Box justifyContent="center" mt={theme.dimensions.standardMarginBetween}>
            <AlertWithHaptics
              variant="warning"
              header={t('travelPay.downtime.title')}
              description={t('downtime.message.1', { endTime })}
              descriptionA11yLabel={t('downtime.message.1.a11yLabel', { endTime })}
            />
            <TravelPayHelp />
          </Box>
        </>
      )
    }

    // When the appointment has a travel pay claim, display the claim details
    const { claim } = attributes.travelPayClaim || {}
    const claimError = attributes.travelPayClaim?.metadata.success === false

    // When travel pay call fails, display an error message
    // Also show in the odd case the appointment can't be looked up in the query data
    if (claimError || appointmentLookupError) {
      return (
        <>
          <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
            {t('travelPay.error.general')}
          </TextView>
          <TravelPayHelp />
        </>
      )
    }

    if (isSubmitting) {
      const linkTextKey = 'travelPay.travelClaimFiledDetails.visitNativeClaimsStatusList.link'

      // We are in the process of submitting a travel pay claim and don't yet have the claim details from the API
      // so we're displaying a placeholder status
      const status = t('travelPay.travelClaimFiledDetails.status.submitting')
      return (
        <>
          <TextView my={theme.dimensions.tinyMarginBetween} variant="MobileBody">
            {t('travelPay.travelClaimFiledDetails.status', { status })}
          </TextView>
          <LinkWithAnalytics
            type="custom"
            onPress={goToTravelClaims}
            text={t(linkTextKey)}
            a11yLabel={a11yLabelVA(t(linkTextKey))}
            testID={`goToVAGovTravelClaimStatus`}
          />
          <TravelPayHelp />
        </>
      )
    }

    if (claim && !travelPayInDowntime) {
      const status = claim.claimStatus
      const claimNumber = claim.claimNumber
      const claimId = claim.id

      return (
        <>
          {claimNumber && (
            <TextView mb={theme.dimensions.condensedMarginBetween}>
              {t('travelPay.travelClaimFiledDetails.claimNumber', { claimNumber })}
            </TextView>
          )}
          <TextView my={theme.dimensions.tinyMarginBetween} variant="MobileBody">
            {t('travelPay.travelClaimFiledDetails.status', { status })}
          </TextView>
          <LinkWithAnalytics
            type="custom"
            onPress={() => {
              if (connectionStatus === CONNECTION_STATUS.DISCONNECTED) {
                showOfflineSnackbar()
                return
              }

              logAnalyticsEvent(Events.vama_link_click)
              navigateTo('TravelPayClaimDetailsScreen', {
                claimId,
              })
            }}
            text={t('travelPay.travelClaimFiledDetails.goToClaimDetails')}
            a11yLabel={a11yLabelVA(t('travelPay.travelClaimFiledDetails.goToClaimDetails'))}
            testID={`goToClaimDetails-${claimId}`}
          />
          <TravelPayHelp />
        </>
      )
    }

    // When the appointment was eligible for travel pay but not filed within 30 days
    const daysLeftToFileTravelPay = getDaysLeftToFileTravelPay(attributes.startDateUtc)

    if (isEligibleForTravelPay(attributes) && daysLeftToFileTravelPay < 0) {
      return (
        <>
          <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
            {t('travelPay.travelClaimFiledDetails.daysLeftToFile', { daysLeft: Math.max(daysLeftToFileTravelPay, 0) })}
          </TextView>
          <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
            {t('travelPay.travelClaimFiledDetails.fileWhenNoDaysLeft')}
          </TextView>
          <LinkWithAnalytics
            type="custom"
            onPress={() => {
              navigateTo('SubmitTravelPayClaimScreen', {
                appointment,
                appointmentRouteKey: route.key,
              })
            }}
            text={t('travelPay.travelClaimFiledDetails.fileTravelReimbursement.link')}
            testID={`goToFileTravelClaimLink`}
          />
          <TravelPayHelp />
        </>
      )
    }

    return null
  }
  switch (subType) {
    case AppointmentDetailsSubTypeConstants.Past:
      const content = getContent()

      if (!content && !travelPayInDowntime) {
        return null
      }
      return (
        <Box testID="travelClaimDetails">
          <TextAreaSpacer />
          <TextView mt={theme.dimensions.condensedMarginBetween} variant="MobileBodyBold">
            {t('travelPay.travelClaimFiledDetails.header')}
          </TextView>
          {content}
        </Box>
      )
    default:
      return null
  }
}

export default AppointmentTravelClaimDetails
