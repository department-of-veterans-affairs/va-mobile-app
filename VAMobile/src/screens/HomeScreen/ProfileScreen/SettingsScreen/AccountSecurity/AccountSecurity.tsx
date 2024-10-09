import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { useTheme } from 'utils/hooks'

type AccountSecurityProps = StackScreenProps<HomeStackParamList, 'AccountSecurity'>

function AccountSecurity({ navigation }: AccountSecurityProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <FeatureLandingTemplate
      backLabel={t('settings.title')}
      backLabelOnPress={navigation.goBack}
      title={t('accountSecurity')}
      testID="accountSecurityScreenID"
      backLabelTestID="backToSettingsScreenID">
      <Box mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('accountSecurity.signIn')}
          </TextView>
          <TextView variant="MobileBody">{t('accountSecurity.description')}</TextView>
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default AccountSecurity
