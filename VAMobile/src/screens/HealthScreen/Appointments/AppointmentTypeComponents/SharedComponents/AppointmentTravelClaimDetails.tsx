import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { AppointmentAttributes } from 'api/types'
import { AlertWithHaptics, Box, LinkWithAnalytics, TextAreaSpacer, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { TravelPayHelp } from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/components'
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { ErrorsState } from 'store/slices'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import {
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  getDaysLeftToFileTravelPay,
  isEligibleForTravelPay,
} from 'utils/appointments'
import getEnv from 'utils/env'
import { formatDateTimeReadable } from 'utils/formattingUtils'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { navigateToTravelClaims, useTravelClaimSubmissionMutationState } from 'utils/travelPay'

const { LINK_URL_TRAVEL_PAY_WEB_DETAILS } = getEnv()

type TravelClaimFiledDetailsProps = {
  appointmentID: string
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
}

function AppointmentTravelClaimDetails({ appointmentID, attributes, subType }: TravelClaimFiledDetailsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  const travelPayInDowntime = useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures)
  const { downtimeWindowsByFeature } = useSelector<RootState, ErrorsState>((state) => state.errors)
  const endTime = formatDateTimeReadable(
    downtimeWindowsByFeature[DowntimeFeatureTypeConstants.travelPayFeatures]?.endTime,
  )

  const mutationState = useTravelClaimSubmissionMutationState(appointmentID)
  const isSubmitting = mutationState?.status === 'pending'

  if (!featureEnabled('travelPaySMOC')) {
    return null
  }

  const goToTravelClaims = () => {
    // Go to the native screen if the FF is on, otherwise
    // continue to go to the web view
    if (featureEnabled('travelPayStatusList')) {
      navigateToTravelClaims(navigateTo)
    } else {
      // To avoid adding a second env variable that is only used for this link that would be a duplicate of LINK_URL_TRAVEL_PAY_WEB_DETAILS,
      // we're reusing the same env variable. Note: the const name refers to "DETAILS" because it's typically used with a claim ID appended,
      // but the base web URL is actually /claims
      logAnalyticsEvent(Events.vama_webview(LINK_URL_TRAVEL_PAY_WEB_DETAILS))
      navigateTo('Webview', {
        url: LINK_URL_TRAVEL_PAY_WEB_DETAILS,
        displayTitle: t('travelPay.travelClaimFiledDetails.visitClaimStatusPage.displayTitle'),
        loadingMessage: t('travelPay.travelClaimFiledDetails.visitClaimStatusPage.loading'),
        useSSO: true,
      })
    }
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

    if (isSubmitting) {
      const linkTextKey = featureEnabled('travelPayStatusList')
        ? 'travelPay.travelClaimFiledDetails.visitNativeClaimsStatusList.link'
        : 'travelPay.travelClaimFiledDetails.visitClaimStatusPage.link'

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
              logAnalyticsEvent(Events.vama_webview(LINK_URL_TRAVEL_PAY_WEB_DETAILS, claimId))
              navigateTo('Webview', {
                url: LINK_URL_TRAVEL_PAY_WEB_DETAILS + claimId,
                displayTitle: t('travelPay.webview.claims.displayTitle'),
                loadingMessage: t('travelPay.webview.claims.loading'),
                useSSO: true,
                backButtonTestID: `webviewBack`,
              })
            }}
            text={t('travelPay.travelClaimFiledDetails.goToVAGov')}
            a11yLabel={a11yLabelVA(t('travelPay.travelClaimFiledDetails.goToVAGov'))}
            testID={`goToVAGovID-${claimId}`}
          />
          <TravelPayHelp />
        </>
      )
    }

    // When travel pay call fails, display an error message
    if (claimError) {
      return (
        <>
          <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
            {t('travelPay.error.general')}
          </TextView>
          <TravelPayHelp />
        </>
      )
    }

    // When the appointment was eligible for travel pay but not filed within 30 days
    const daysLeftToFileTravelPay = getDaysLeftToFileTravelPay(attributes.startDateUtc)

    // Api is currently returning only claims for the last 30 days, so for appointments > 30 days old we can't tell if a claim exists.
    // This feature toggle is used to enable the full history of claims once the API is updated to return all claims.
    const apiReturnsFullHistory = featureEnabled('travelPayClaimsFullHistory')

    if (apiReturnsFullHistory && isEligibleForTravelPay(attributes) && daysLeftToFileTravelPay < 0 && !claimError) {
      return (
        <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
          {t('travelPay.travelClaimFiledDetails.noClaim')}
        </TextView>
      )
    }

    if (!apiReturnsFullHistory && daysLeftToFileTravelPay < 0 && !claimError) {
      const { messageTextKey, linkTextKey } = featureEnabled('travelPayStatusList')
        ? {
            messageTextKey: 'travelPay.travelClaimFiledDetails.yourAppointmentIsPast30Days',
            linkTextKey: 'travelPay.travelClaimFiledDetails.visitNativeClaimsStatusList.link',
          }
        : {
            messageTextKey: 'travelPay.travelClaimFiledDetails.visitClaimStatusPage',
            linkTextKey: 'travelPay.travelClaimFiledDetails.visitClaimStatusPage.link',
          }

      return (
        <>
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
          <TextView
            accessibilityLabel={a11yLabelVA(t(messageTextKey))}
            mb={theme.dimensions.condensedMarginBetween}
            variant="MobileBody">
            {t(messageTextKey)}
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
