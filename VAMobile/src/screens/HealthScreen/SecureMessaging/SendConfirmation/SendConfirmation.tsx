import React, { FC, ReactNode, useEffect } from 'react'

import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'

import { AlertBox, BackButton, Box, ClickToCallPhoneNumber, CrisisLineCta, LoadingComponent, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingState, StoreState, resetSendMessageComplete, resetSendMessageFailed, sendMessage, updateSecureMessagingTab } from 'store'
import { SecureMessagingTabTypesConstants } from 'store/api/types'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { formHeaders } from 'constants/secureMessaging'
import { useDispatch, useSelector } from 'react-redux'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ConfirmationAlert from 'components/ConfirmationAlert'

type SendConfirmationProps = StackScreenProps<HealthStackParamList, 'SendConfirmation'>

const SendConfirmation: FC<SendConfirmationProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const th = useTranslation(NAMESPACE.HOME)
  const theme = useTheme()
  const { originHeader, origin, messageData, uploads } = route.params
  const navigateTo = useRouteNavigation()
  const dispatch = useDispatch()
  const { sendingMessage, sendMessageComplete, sendMessageFailed } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  // Function to reset sendMessageFailed attribute to false when clicking the back button
  const onPressBack = () => {
    dispatch(resetSendMessageFailed())
    navigation.goBack()
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={onPressBack} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
      headerTitle: originHeader,
    })
  })
  // TODO: Will use different navigation result and store variable for reply dispatch
  useEffect(() => {
    // SendMessageComplete variable is tied to compose message dispatch function. Once message is sent we want to set that variable to false
    if (sendMessageComplete) {
      dispatch(resetSendMessageComplete())

      // Go to Inbox
      dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))
      navigation.navigate('SecureMessaging')
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
        {sendMessageFailed && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox
              border={'error'}
              background={'noCardBackground'}
              title={t('secureMessaging.sendError.title')}
              text={t('secureMessaging.sendError.ifTheAppStill')}
              textA11yLabel={t('secureMessaging.sendError.ifTheAppStill.a11y')}>
              {<ClickToCallPhoneNumber phone={t('secureMessaging.attachments.FAQ.ifYourProblem.phone')} {...a11yHintProp(th('veteransCrisisLine.callA11yHint'))} />}
            </AlertBox>
          </Box>
        )}
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
          cancelOnPress={onPressBack}
        />
      </Box>
    </VAScrollView>
  )
}

export default SendConfirmation
