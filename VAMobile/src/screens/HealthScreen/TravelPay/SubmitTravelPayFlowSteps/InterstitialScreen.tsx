import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, LinkWithAnalytics, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useDestructiveActionSheet, useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSMOCAnalyticsPageView } from 'utils/travelPay'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'

const { LINK_URL_TRAVEL_PAY_ELIGIBILITY, LINK_URL_TRAVEL_PAY_SET_UP_DIRECT_DEPOSIT } = getEnv()

type InterstitialScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'InterstitialScreen'>

function InterstitialScreen({ navigation }: InterstitialScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  useSMOCAnalyticsPageView('intro')

  const theme = useTheme()
  const isPortrait = useOrientation()
  const navigateTo = useRouteNavigation()
  const confirmAlert = useDestructiveActionSheet()

  const onLeftButtonPress = () => {
    logAnalyticsEvent(Events.vama_smoc_button_click('intro', 'cancel'))
    confirmAlert({
      title: t('travelPay.cancelClaim.title'),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('travelPay.cancelClaim.continue'),
          onPress: () => {
            logAnalyticsEvent(Events.vama_smoc_button_click('intro', 'keep going'))
          },
        },
        {
          text: t('travelPay.cancelClaim.cancel'),
          onPress: () => {
            logAnalyticsEvent(Events.vama_smoc_button_click('intro', 'cancel claim'))
            navigation.goBack()
          },
        },
      ],
    })
  }

  useSubtaskProps({
    leftButtonText: t('cancel'),
    leftButtonTestID: 'leftCancelTestID',
    onLeftButtonPress,
    primaryContentButtonText: t('continue'),
    primaryButtonTestID: 'continueTestID',
    onPrimaryContentButtonPress: () => {
      logAnalyticsEvent(Events.vama_smoc_button_click('intro', 'continue'))
      navigateTo('MileageScreen')
    },
  })

  return (
    <VAScrollView testID="InterstitialScreen">
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView testID="milageQuestionID" variant="BitterHeading" accessibilityRole="header">
          {t('travelPay.beforeYouFileQuestion')}
        </TextView>
        <TextView testID="eligibilityTitleID" variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.checkEligibility')}
        </TextView>
        <TextView testID="eligibilityDescriptionID" variant="MobileBody">
          {t('travelPay.checkEligibility.description')}
        </TextView>
        <LinkWithAnalytics
          type="url"
          url={LINK_URL_TRAVEL_PAY_ELIGIBILITY}
          text={t('travelPay.checkEligibility.link')}
          a11yLabel={a11yLabelVA(t('travelPay.checkEligibility.link'))}
          testID="checkEligibilityLinkID"
          analyticsOnPress={() => {
            logAnalyticsEvent(Events.vama_smoc_button_click('intro', 'check eligibility'))
          }}
        />
        <TextView testID="directDepositTitleID" variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.setUpDirectDeposit')}
        </TextView>
        <TextView testID="directDepositDescriptionID" variant="MobileBody">
          {t('travelPay.setUpDirectDeposit.description')}
        </TextView>
        <LinkWithAnalytics
          type="url"
          url={LINK_URL_TRAVEL_PAY_SET_UP_DIRECT_DEPOSIT}
          text={t('travelPay.setUpDirectDeposit.link')}
          a11yLabel={a11yLabelVA(t('travelPay.setUpDirectDeposit.link'))}
          testID="setUpDirectDepositLinkID"
          analyticsOnPress={() => {
            logAnalyticsEvent(Events.vama_smoc_button_click('intro', 'set up direct deposit'))
          }}
        />
        <TextView mt={theme.dimensions.condensedMarginBetween} testID="burdenTimeID" variant="MobileBody">
          {t('travelPay.burdenTime')}
        </TextView>
        <TextView mt={theme.dimensions.tinyMarginBetween} testID="ombControlNumberID" variant="MobileBody">
          {t('travelPay.ombControlNumber')}
        </TextView>
        <TextView mt={theme.dimensions.tinyMarginBetween} testID="ombExpirationDateID" variant="MobileBody">
          {t('travelPay.ombExpirationDate')}
        </TextView>
        <LinkWithAnalytics
          type="custom"
          onPress={() => {
            logAnalyticsEvent(Events.vama_smoc_button_click('intro', 'review privacy statement'))
            navigateTo('BurdenStatementScreen')
          }}
          text={t('travelPay.reviewPrivacyStatement')}
          a11yLabel={a11yLabelVA(t('travelPay.reviewPrivacyStatement'))}
          testID="reviewPrivacyStatementLinkID"
        />
      </Box>
    </VAScrollView>
  )
}

export default InterstitialScreen
