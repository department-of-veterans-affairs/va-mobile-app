import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, LargePanel, TextView, VABulletList } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'
import { useSMOCAnalyticsPageView } from 'utils/travelPay'

import { FileOnlineComponent, TravelPayHelp } from './components'

function TravelClaimHelpScreen() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  useSMOCAnalyticsPageView('help')

  return (
    <LargePanel
      title={t('travelPay.help.title')}
      rightButtonText={t('close')}
      testID="travelClaimHelpScreenID"
      rightButtonTestID="rightCloseTestID"
      children={
        <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          <TextView testID="travelClaimHelpTitleID" variant="MobileBodyBold">
            {t('travelPay.help.useThisApp')}
          </TextView>
          <TextView testID="travelClaimHelpTextID" variant="MobileBody">
            {t('travelPay.help.youCanStillFile')}
          </TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VABulletList
              listOfText={[
                t('travelPay.help.youCanStillFile.bulletOne'),
                t('travelPay.help.youCanStillFile.bulletTwo'),
                t('travelPay.help.youCanStillFile.bulletThree'),
              ]}
            />
          </Box>
          <FileOnlineComponent
            btsssAnalyticsOnPress={() => {
              logAnalyticsEvent(Events.vama_smoc_button_click('help', 'file onlinebtsss'))
            }}
            vaFormAnalyticsOnPress={() => {
              logAnalyticsEvent(Events.vama_smoc_button_click('help', 'va form103542'))
            }}
          />
          <TravelPayHelp />
        </Box>
      }
    />
  )
}

export default TravelClaimHelpScreen
