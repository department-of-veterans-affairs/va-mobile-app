import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { Box, TextArea, TextView, TextViewProps, VAScrollView } from 'components'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileStackScreens'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type HowDoIUpdateScreenProps = StackScreenProps<ProfileStackParamList, 'HowDoIUpdate'>

const HowDoIUpdateScreen: FC<HowDoIUpdateScreenProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={t('howDoIUpdate.title')} accessibilityRole="header">
          {t('howDoIUpdate.title')}
        </HiddenTitle>
      ),
    })
  })

  const linkProps: TextViewProps = {
    onPress: navigateTo('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: t('common:webview.vagov') }),
    variant: 'MobileBody',
    color: 'link',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    accessibilityRole: 'link',
  }

  return (
    <VAScrollView {...testIdProps(generateTestID(t('howDoIUpdate.title'), ''))}>
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
    </VAScrollView>
  )
}

export default HowDoIUpdateScreen
