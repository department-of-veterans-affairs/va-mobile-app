import React from 'react'
import { useTranslation } from 'react-i18next'
import { Screen } from 'react-native-screens'
import { useSelector } from 'react-redux'

import { AppointmentAttributes } from 'api/types'
import {
  AlertWithHaptics,
  Box,
  BoxProps,
  ClickToCallPhoneNumber,
  DowntimeError,
  ErrorComponent,
  LinkWithAnalytics,
  TextView,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api'
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
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'

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

function TravelClaimFiledDetails({ attributes, subType }: TravelClaimFiledDetailsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  const getContent = () => {
    // When the appointment has a travel pay claim, display the claim details
    const { claim } = attributes.travelPayClaim || {}
    const claimError = attributes.travelPayClaim?.metadata.success === false

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
            a11yLabel={a11yLabelVA(t('travelPay.travelClaimFiledDetails.goToVAGov'))}
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
              displayedText={displayedTextPhoneNumber(t('travelPay.phone'))}
            />
          </Box>
        </>
      )
    }

    if (claimError) {
      return (
        <>
          <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
            {t('travelPay.error.general')}
          </TextView>
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
              displayedText={displayedTextPhoneNumber(t('travelPay.phone'))}
            />
          </Box>
        </>
      )
    }

    const daysLeftToFileTravelPay = getDaysLeftToFileTravelPay(attributes.startDateUtc)

    if (!claim && appointmentMeetsTravelPayCriteria(attributes) && daysLeftToFileTravelPay < 0) {
      return (
        <TextView mb={theme.dimensions.condensedMarginBetween} variant="MobileBody">
          {t('travelPay.travelClaimFiledDetails.noClaim')}
        </TextView>
      )
    }

    // const travelPayInDowntime = useDowntime(DowntimeFeatureTypeConstants.travelPay)
    // // const { downtimeWindowsByFeature } = useSelector<RootState, ErrorsState>((state) => state.errors)
    // // const endTime =
    // //   downtimeWindowsByFeature[DowntimeFeatureTypeConstants.travelPay]?.endTime?.toFormat("DDD 'at' t ZZZZ")

    // if (travelPayInDowntime) {
    //   return <DowntimeError screenID={ScreenIDTypesConstants.TRAVEL_PAY_SUBMISSION_SCREEN_ID} />
    // }

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

// const HelpContent = () => {
//   const { t } = useTranslation(NAMESPACE.COMMON)
//   const theme = useTheme()

//   return (
//     <>
//       <TextView testID="helpTitleID" variant="MobileBodyBold" mt={theme.dimensions.condensedMarginBetween}>
//         {t('travelPay.travelClaimFiledDetails.needHelp')}
//       </TextView>
//       <TextView testID="helpTextID" variant="MobileBody">
//         {t('travelPay.helpText')}
//       </TextView>
//       <Box my={theme.dimensions.condensedMarginBetween}>
//         <ClickToCallPhoneNumber
//           phone={t('travelPay.phone')}
//           center={false}
//           displayedText={displayedTextPhoneNumber(t('travelPay.phone'))}
//         />
//       </Box>
//     </>
//   )
// }
