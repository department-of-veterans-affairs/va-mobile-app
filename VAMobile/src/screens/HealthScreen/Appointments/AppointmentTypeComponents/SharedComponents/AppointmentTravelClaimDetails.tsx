import React from 'react'
import { useTranslation } from 'react-i18next'

import { AppointmentAttributes } from 'api/types'
import { Box, BoxProps, ClickToCallPhoneNumber, LinkWithAnalytics, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import {
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  appointmentMeetsTravelPayCriteria,
} from 'utils/appointments'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const { LINK_URL_TRAVEL_PAY_WEB_DETAILS = 'https://www.staging.va.gov/my-health/travel-pay/claims/' } = getEnv()

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

function TravelClaimFiledDetails({ attributes, subType }: TravelClaimFiledDetailsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  const getContent = () => {
    const isTravelPayAppointment = appointmentMeetsTravelPayCriteria(attributes)
    if (!isTravelPayAppointment) {
      return null
    }
    const { claim } = attributes.travelPayClaim || {}
    if (claim) {
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
              })
            }}
            text={t('travelPay.travelClaimFiledDetails.goToVAGov')}
            a11yLabel={a11yLabelVA(t('goToVAGov'))}
            a11yHint={t('travelPay.travelClaimFiledDetails.goToVAGovA11yHint')}
            testID={`goToVAGovID-${claimId}`}
          />
          <TextView testID="helpTitleID" variant="MobileBodyBold" mt={theme.dimensions.condensedMarginBetween}>
            {t('travelPay.travelClaimFiledDetails.needHelp')}
          </TextView>
          <TextView testID="helpTextID" variant="MobileBody">
            {t('travelPay.helpText')}
          </TextView>
          <Box my={theme.dimensions.condensedMarginBetween}>
            <ClickToCallPhoneNumber
              phone={t('travelPay.phone')}
              center={false}
              a11yLabel={'travelPay.phone.a11yHint'}
            />
          </Box>
        </>
      )
    }

    return null
  }

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.Past:
      const content = getContent()

      if (!content) {
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

export default TravelClaimFiledDetails
