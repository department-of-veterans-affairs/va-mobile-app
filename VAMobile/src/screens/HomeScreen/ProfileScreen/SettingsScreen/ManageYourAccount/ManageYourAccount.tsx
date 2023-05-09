import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useEffect } from 'react'

import { BackButton, Box, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HiddenTitle } from 'styles/common'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type ManageYourAccountProps = StackScreenProps<HomeStackParamList, 'ManageYourAccount'>

const ManageYourAccount: FC<ManageYourAccountProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={t('manageAccount.titlePage')} accessibilityRole="header">
          {t('manageAccount.titlePage')}
        </HiddenTitle>
      ),
      headerLeft: (props): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} a11yHint={t('settings.backButton.a11yHint')} />
      ),
    })
  })

  return (
    <FeatureLandingTemplate backLabel={t('settings.title')} backLabelOnPress={navigation.goBack} title={t('manageAccount.title')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header" paragraphSpacing={true}>
            {t('manageAccount.title')}
          </TextView>
          <TextView variant="MobileBody">{t('manageAccount.toConfirmOrUpdateEmail')}</TextView>
        </TextArea>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default ManageYourAccount
