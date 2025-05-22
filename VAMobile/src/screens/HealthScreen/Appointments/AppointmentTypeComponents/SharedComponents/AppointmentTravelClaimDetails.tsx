import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { AppointmentAttributes } from 'api/types'
import { AlertWithHaptics, Box, BoxProps, LinkWithAnalytics, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { ErrorsState } from 'store/slices'
import { VATheme } from 'styles/theme'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import {
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  appointmentMeetsTravelPayCriteria,
  getDaysLeftToFileTravelPay,
} from 'utils/appointments'
import getEnv from 'utils/env'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'

import { TravelPayHelp } from '../../../TravelPay/SubmitTravelPayFlowSteps/components'

const { LINK_URL_TRAVEL_PAY_WEB_DETAILS } = getEnv()

type TravelClaimFiledDetailsProps = {
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
}

const spacer = (theme: VATheme) => {
  const boxProps: BoxProps = {
    borderStyle: 'solid',
    borderBottomWidth: 'default',
    borderBottomColor: 'primary',
    borderTopWidth: 'default',
    borderTopColor: 'primary',
    height: theme.dimensions.standardMarginBetween,
    backgroundColor: 'main',
    mx: -theme.dimensions.gutter,
  }
  return <Box {...boxProps} />
}

function AppointmentTravelClaimDetails({ attributes, subType }: TravelClaimFiledDetailsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  const travelPayInDowntime = useDowntime(DowntimeFeatureTypeConstants.travelPayFeatures)
  const { downtimeWindowsByFeature } = useSelector<RootState, ErrorsState>((state) => state.errors)
  const endTime =
    downtimeWindowsByFeature[DowntimeFeatureTypeConstants.travelPayFeatures]?.endTime?.toFormat('EEEE, fff')

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

    if (!claim && appointmentMeetsTravelPayCriteria(attributes) && daysLeftToFileTravelPay < 0 && !claimError) {
      return (
        <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
          {t('travelPay.travelClaimFiledDetails.noClaim')}
        </TextView>
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
          {spacer(theme)}
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
