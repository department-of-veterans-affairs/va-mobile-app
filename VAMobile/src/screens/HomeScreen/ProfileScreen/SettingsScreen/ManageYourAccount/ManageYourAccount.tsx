import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type ManageYourAccountProps = StackScreenProps<HomeStackParamList, 'ManageYourAccount'>

const ManageYourAccount: FC<ManageYourAccountProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <FeatureLandingTemplate backLabel={t('settings.title')} backLabelOnPress={navigation.goBack} title={t('manageAccount.title')}>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('manageAccount.title')}
          </TextView>
          <TextView variant="MobileBody">{t('manageAccount.toConfirmOrUpdateEmail')}</TextView>
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default ManageYourAccount
