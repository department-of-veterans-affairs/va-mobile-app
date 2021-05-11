import React, { FC, ReactNode, useEffect } from 'react'

import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'

import { BackButton, Box, CrisisLineCta, LoadingComponent, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingState, StoreState, resetSendMessageComplete, sendMessage } from 'store'
import { formHeaders } from 'constants/secureMessaging'
import { testIdProps } from 'utils/accessibility'
import { useDispatch, useSelector } from 'react-redux'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ConfirmationAlert from 'components/ConfirmationAlert'

type SendConfirmationProps = StackScreenProps<HealthStackParamList, 'SendConfirmation'>

const SendConfirmation: FC<SendConfirmationProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const { originHeader, origin, messageData, uploads } = route.params
  const navigateTo = useRouteNavigation()
  const dispatch = useDispatch()
  const { sendingMessage, sendMessageComplete } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
      headerTitle: originHeader,
    })
  })

  // TODO: Will use different navigation result and store variable for reply dispatch
  useEffect(() => {
    // SendMessageComplete variable is tied to compose message dispatch function. Once message is sent we want to set that variable to false
    if (sendMessageComplete) {
      dispatch(resetSendMessageComplete())

      // Go to successful send screen
      navigation.navigate('SuccessfulSendScreen')
    }
  }, [sendMessageComplete, dispatch, navigation])

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const onSend = (): void => {
    // Depending on whether sending from reply or compose form, dispatch associated redux action
    if (origin === formHeaders.compose) {
      dispatch(sendMessage(messageData, uploads))
    } else {
      // TODO: call dispatch for replyMessage, then navigate to message thread
      // Need to take in parameter for messageID
    }
    return
  }

  if (sendingMessage) {
    return <LoadingComponent text={t('secureMessaging.formMessage.send.loading')} />
  }

  return (
    <VAScrollView {...testIdProps('Send Confirmation: Send-message-confirmation-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <ConfirmationAlert
          title={t('secureMessaging.sendConfirmation.question')}
          text={t('secureMessaging.sendConfirmation.areYouSure')}
          background="noCardBackground"
          border="warning"
          confirmLabel={t('secureMessaging.sendConfirmation.sendButton')}
          cancelLabel={t('secureMessaging.sendConfirmation.editingButton')}
          confirmA11y={t('secureMessaging.sendConfirmation.sendButton.a11y')}
          cancelA11y={t('secureMessaging.sendConfirmation.editingButton.a11y')}
          confirmOnPress={onSend}
          cancelOnPress={navigation.goBack}
        />
      </Box>
    </VAScrollView>
  )
}

export default SendConfirmation
