import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, LargePanel, LinkWithAnalytics, TextView, VABulletList } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useBeforeNavBackListener, useRouteNavigation, useTheme } from 'utils/hooks'

type InAppRecruitmentScreenProps = StackScreenProps<HomeStackParamList, 'InAppRecruitment'>

const { LINK_URL_IN_APP_RECRUITMENT, LINK_URL_VETERAN_USABILITY_PROJECT } = getEnv()

function InAppRecruitmentScreen({ navigation }: InAppRecruitmentScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const currentScreenName = useNavigationState((state) => state.routes[state.routes.length - 1]).name
  const [isWebviewOpen, setIsWebviewOpen] = useState(false)

  useBeforeNavBackListener(navigation, () => {
    logAnalyticsEvent(Events.vama_givefb_close(currentScreenName))
  })

  useEffect(() => {
    // Track when the user is leaving the Webview
    if (isWebviewOpen && currentScreenName !== 'Webview') {
      logAnalyticsEvent(Events.vama_givefb_close('Webview'))
      setIsWebviewOpen(false)
    }
  }, [isWebviewOpen, currentScreenName])

  const onPress = () => {
    logAnalyticsEvent(Events.vama_givefb_open('launch'))
    navigateTo('Webview', {
      url: LINK_URL_IN_APP_RECRUITMENT,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('inAppRecruitment.goToQuestionnaire.loading'),
    })
    setIsWebviewOpen(true)
  }

  return (
    <LargePanel title={t('inAppRecruitment.userResearch')} rightButtonText={t('close')}>
      <Box
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.contentMarginBottom}
        mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('inAppRecruitment.makeAppBetter.header')}
        </TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('inAppRecruitment.makeAppBetter.body')}
        </TextView>
        <VABulletList
          listOfText={[
            {
              text: t('inAppRecruitment.makeAppBetter.bullet.1'),
            },
            {
              text: t('inAppRecruitment.makeAppBetter.bullet.2'),
            },
            {
              text: t('inAppRecruitment.makeAppBetter.bullet.3'),
              a11yLabel: a11yLabelVA(t('inAppRecruitment.makeAppBetter.bullet.3')),
            },
          ]}
          paragraphSpacing={true}
        />
        <Button onPress={onPress} label={t('inAppRecruitment.goToQuestionnaire')} />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <LinkWithAnalytics
            type="url"
            url={LINK_URL_VETERAN_USABILITY_PROJECT}
            text={t('inAppRecruitment.learnMore')}
            a11yLabel={t('inAppRecruitment.learnMore')}
            analyticsOnPress={() => logAnalyticsEvent(Events.vama_givefb_open('info'))}
            testID="inAppRecruitmentLearnMoreTestID"
          />
        </Box>
        <TextView
          variant="HelperText"
          mt={theme.dimensions.standardMarginBetween}
          paragraphSpacing={true}
          accessibilityLabel={a11yLabelVA(t('inAppRecruitment.contracts'))}>
          {t('inAppRecruitment.contracts')}
        </TextView>
      </Box>
    </LargePanel>
  )
}

export default InAppRecruitmentScreen
