import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, VAButton, VAButtonProps } from 'components'
import { Events } from 'constants/analytics'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { StackNavigationProp } from '@react-navigation/stack'
import { logAnalyticsEvent } from 'utils/analytics'
import { useNavigation } from '@react-navigation/native'
import { useTheme } from 'utils/hooks'

const StartNewMessageButton: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigation = useNavigation<StackNavigationProp<HealthStackParamList, keyof HealthStackParamList>>()
  const theme = useTheme()
  const onPress = () => {
    logAnalyticsEvent(Events.vama_sm_start())
    navigation.navigate('StartNewMessage', { attachmentFileToAdd: {}, attachmentFileToRemove: {} })
  }

  const startNewMessageButtonProps: VAButtonProps = {
    label: t('secureMessaging.startNewMessage'),
    buttonType: ButtonTypesConstants.buttonPrimary,
    onPress: onPress,
    iconProps: { name: 'Compose', fill: 'navBar' },
    testID: 'startNewMessageButtonTestID',
  }

  return (
    <Box mx={theme.dimensions.buttonPadding}>
      <VAButton {...startNewMessageButtonProps} />
    </Box>
  )
}

export default StartNewMessageButton
