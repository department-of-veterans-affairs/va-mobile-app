import { StackScreenProps } from '@react-navigation/stack'
import { testIdProps } from 'utils/accessibility'

import { BackButton, Box, CrisisLineCta, LoadingComponent, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { resetHasLoadedRecipients, resetReplyTriageError, resetSendMessageComplete, resetSendMessageFailed, sendMessage } from 'store/slices/secureMessagingSlice'
import { useAppDispatch, useAppSelector, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ConfirmationAlert from 'components/ConfirmationAlert'
import React, { FC, ReactNode, useEffect } from 'react'

type SendConfirmationProps = StackScreenProps<HealthStackParamList, 'SendConfirmation'>

const SendConfirmation: FC<SendConfirmationProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const { originHeader, messageData, uploads, replyToID } = route.params
  const navigateTo = useRouteNavigation()
  const dispatch = useAppDispatch()
  const { sendingMessage, sendMessageComplete, sendMessageFailed, replyTriageError } = useAppSelector((state) => state.secureMessaging)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => <BackButton onPress={navigation.goBack} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />,
      headerTitle: originHeader,
    })
  })

  useEffect(() => {
    if (replyTriageError) {
      dispatch(resetReplyTriageError())
      dispatch(resetSendMessageFailed())
      dispatch(resetHasLoadedRecipients())
      navigation.navigate('ReplyTriageErrorScreen')
    } else if (sendMessageFailed) {
      // Return to form
      navigation.goBack()
    }
  }, [sendMessageFailed, dispatch, navigation, replyTriageError])

  useEffect(() => {
    // SendMessageComplete variable is tied to send message dispatch function. Once message is sent we want to set that variable to false
    if (sendMessageComplete) {
      dispatch(resetSendMessageComplete())
      dispatch(resetHasLoadedRecipients())

      // Go to successful send screen
      navigation.navigate('SuccessfulSendScreen')
    }
  }, [sendMessageComplete, dispatch, navigation])

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const onSend = (): void => {
    dispatch(sendMessage(messageData, uploads, replyToID))
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
