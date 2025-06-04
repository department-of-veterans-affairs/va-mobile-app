import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'

type HowWillYouScreenProps = StackScreenProps<HomeStackParamList, 'HowWillYou'>

function HowWillYouScreen({}: HowWillYouScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel title={t('profile.help.title')} rightButtonText={t('close')} rightButtonTestID="ContactInfoCloseTestID">
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('contactInformation.howWillYouUseContactInfo')}
        </TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('howWillYou.useInfo.1')}
        </TextView>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('howWillYou.useInfo.2'))}>
          {t('howWillYou.useInfo.2')}
        </TextView>
      </Box>
    </LargePanel>
  )
}

export default HowWillYouScreen
