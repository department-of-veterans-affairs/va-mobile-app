import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, LargePanel, TextView } from 'components'
import { HiddenTitle } from 'styles/common'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type HowWillYouScreenProps = StackScreenProps<HomeStackParamList, 'HowWillYou'>

const HowWillYouScreen: FC<HowWillYouScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={t('howWillYou.title')} accessibilityRole="header">
          {t('howWillYou.title')}
        </HiddenTitle>
      ),
    })
  })

  return (
    <LargePanel title={t('profile.help.title')} rightButtonText={t('close')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('contactInformation.howWillYouUseContactInfo')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true}>
          {t('howWillYou.useInfo.1')}
        </TextView>
        <TextView variant="MobileBody" accessibilityLabel={t('howWillYou.useInfo.2.a11yLabel')}>
          {t('howWillYou.useInfo.2')}
        </TextView>
      </Box>
    </LargePanel>
  )
}

export default HowWillYouScreen
