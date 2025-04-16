import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LinkWithAnalytics, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'

const { LINK_URL_TRAVEL_PAY_ELIGIBILITY, LINK_URL_TRAVEL_PAY_SET_UP_DIRECT_DEPOSIT } = getEnv()

function InterstitialScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const theme = useTheme()
  const isPortrait = useOrientation()
  const navigateTo = useRouteNavigation()

  return (
    <VAScrollView>
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
          testID="checkEligibilityLinkID"
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
          testID="setUpDirectDepositLinkID"
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
