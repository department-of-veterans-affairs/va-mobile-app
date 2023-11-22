import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { Box, ButtonTypesConstants, ClickForActionLink, LargePanel, LinkTypeOptionsConstants, TextView, VABulletList, VAButton } from 'components'
import { Events } from 'constants/analytics'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { useBeforeNavBackListener, useRouteNavigation, useTheme } from 'utils/hooks'
import { useNavigationState } from '@react-navigation/native'
import getEnv from 'utils/env'

type InAppRecruitmentScreenProps = StackScreenProps<HomeStackParamList, 'InAppRecruitment'>

const { LINK_URL_IN_APP_RECRUITMENT, LINK_URL_VETERAN_USABILITY_PROJECT } = getEnv()

const InAppRecruitmentScreen: FC<InAppRecruitmentScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const currentScreen = useNavigationState((state) => state.routes[state.routes.length - 1])
  const [isWebviewOpen, setIsWebviewOpen] = useState(false)

  useBeforeNavBackListener(navigation, () => {
    logAnalyticsEvent(Events.vama_givefb_close())
  })

  useEffect(() => {
    // Track when the user is leaving the Webview
    if (isWebviewOpen && currentScreen.name !== 'Webview') {
      logAnalyticsEvent(Events.vama_givefb_wv_close())
      setIsWebviewOpen(false)
    }
  }, [isWebviewOpen, currentScreen])

  const onPress = () => {
    logAnalyticsEvent(Events.vama_givefb_launch())
    navigateTo('Webview', {
      url: LINK_URL_IN_APP_RECRUITMENT,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('inAppRecruitment.goToQuestionnaire.loading'),
    })()
    setIsWebviewOpen(true)
  }

  return (
    <LargePanel title={t('inAppRecruitment.giveFeedback')} rightButtonText={t('close')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
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
              a11yLabel: t('secureMessaging.replyHelp.ifYouThink') + t('secureMessaging.replyHelp.call911OrGoTo'),
            },
            {
              text: t('inAppRecruitment.makeAppBetter.bullet.2'),
              a11yLabel: t('secureMessaging.replyHelp.ifYouThink') + t('secureMessaging.replyHelp.call911OrGoTo'),
            },
            {
              text: t('inAppRecruitment.makeAppBetter.bullet.3'),
              a11yLabel: a11yLabelVA(t('inAppRecruitment.makeAppBetter.bullet.3')),
            },
          ]}
        />
        <VAButton onPress={onPress} label={t('inAppRecruitment.goToQuestionnaire')} buttonType={ButtonTypesConstants.buttonPrimary} />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <ClickForActionLink
            displayedText={t('inAppRecruitment.learnMore')}
            numberOrUrlLink={LINK_URL_VETERAN_USABILITY_PROJECT}
            linkType={LinkTypeOptionsConstants.url}
            a11yLabel={t('inAppRecruitment.learnMore')}
            fireAnalytic={() => logAnalyticsEvent(Events.vama_givefb_info())}
          />
        </Box>
        <TextView variant="HelperText" mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true} accessibilityLabel={a11yLabelVA(t('inAppRecruitment.contracts'))}>
          {t('inAppRecruitment.contracts')}
        </TextView>
      </Box>
    </LargePanel>
  )
}

export default InAppRecruitmentScreen
