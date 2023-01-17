import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, LargePanel, TextArea, TextView, TextViewProps } from 'components'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileStackScreens'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type HowDoIUpdateScreenProps = StackScreenProps<ProfileStackParamList, 'HowDoIUpdate'>

const HowDoIUpdateScreen: FC<HowDoIUpdateScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={t('profile.help.title')} accessibilityRole="header">
          {t('profile.help.title')}
        </HiddenTitle>
      ),
    })
  })

  const linkProps: TextViewProps = {
    onPress: navigateTo('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: t('webview.vagov'), loadingMessage: th('webview.valocation.loading') }),
    variant: 'MobileBody',
    color: 'link',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    accessibilityRole: 'link',
  }

  return (
    <LargePanel title={t('profile.help.title')} rightButtonText={t('close')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('howDoIUpdate.ifEnrolledInVAHealth')}
          </TextView>
          <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
            {t('howDoIUpdate.pleaseContactNearestVAMed')}
          </TextView>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('howDoIUpdate.ifNotEnrolledInVAHealth')}
          </TextView>
          <TextView variant="MobileBody" mt={7} mb={20}>
            {t('howDoIUpdate.pleaseContactNearestVARegional')}
          </TextView>
          <TextView {...linkProps} {...testIdProps(t('howDoIUpdate.findYourNearestVALocationA11yLabel'))} {...a11yHintProp(t('howDoIUpdate.findYourNearestVALocationA11yHint'))}>
            {t('howDoIUpdate.findYourNearestVALocation')}
          </TextView>
        </TextArea>
      </Box>
    </LargePanel>
  )
}

export default HowDoIUpdateScreen
