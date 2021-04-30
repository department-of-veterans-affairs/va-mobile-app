import React, { FC, ReactNode, useEffect } from 'react'

import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'

import { BackButton, Box, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import ConfirmationAlert from 'components/ConfirmationAlert'

type SendConfirmationProps = StackScreenProps<HealthStackParamList, 'SendConfirmation'>

const SendConfirmation: FC<SendConfirmationProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const { originHeader } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
      headerTitle: originHeader,
    })
  })

  // TODO: Later PR will handle routing action on clicking 'Send' button
  const onSend = () => {}

  return (
    <VAScrollView {...testIdProps('Send Confirmation: Send-message-confirmation-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <ConfirmationAlert
          title={t('secureMessaging.sendConfirmation.question')}
          text={t('secureMessaging.sendConfirmation.areYouSure')}
          background="noCardBackground"
          border="warning"
          button1Label={t('secureMessaging.sendConfirmation.sendButton')}
          button2Label={t('secureMessaging.sendConfirmation.editingButton')}
          button1A11y={t('secureMessaging.sendConfirmation.sendButton.a11y')}
          button2A11y={t('secureMessaging.sendConfirmation.editingButton.a11y')}
          button1OnPress={onSend}
          button2OnPress={navigation.goBack}
        />
      </Box>
    </VAScrollView>
  )
}

export default SendConfirmation
