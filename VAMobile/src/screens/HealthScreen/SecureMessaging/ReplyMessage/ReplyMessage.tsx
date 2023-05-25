import { DateTime } from 'luxon'
import { InteractionManager, ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'
import _ from 'underscore'

import {
  BackButton,
  Box,
  ButtonTypesConstants,
  CollapsibleView,
  FieldType,
  FormFieldType,
  FormWrapper,
  FullScreenSubtask,
  LoadingComponent,
  MessageAlert,
  SaveButton,
  TextArea,
  TextView,
  VAButton,
} from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { FolderNameTypeConstants, FormHeaderTypeConstants, PREPOPULATE_SIGNATURE } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { SecureMessagingFormData, SecureMessagingSystemFolderIdConstants, SecureMessagingTabTypesConstants } from 'store/api/types'
import {
  SecureMessagingState,
  dispatchSetActionStart,
  getMessageSignature,
  resetSendMessageComplete,
  resetSendMessageFailed,
  saveDraft,
  sendMessage,
  updateSecureMessagingTab,
} from 'store/slices'
import { SnackbarMessages } from 'components/SnackBar'
import { VATheme } from 'styles/theme'
import { formatSubject } from 'utils/secureMessaging'
import { renderMessages } from '../ViewMessage/ViewMessageScreen'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useAttachments, useMessageWithSignature, useRouteNavigation, useTheme, useValidateMessageWithSignature } from 'utils/hooks'
import { useComposeCancelConfirmation } from '../CancelConfirmations/ComposeCancelConfirmation'
import { useSelector } from 'react-redux'

type ReplyMessageProps = StackScreenProps<HealthStackParamList, 'ReplyMessage'>

const ReplyMessage: FC<ReplyMessageProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme() as VATheme
  const navigateTo = useRouteNavigation()
  const dispatch = useAppDispatch()

  const [onSendClicked, setOnSendClicked] = useState(false)
  const [onSaveDraftClicked, setOnSaveDraftClicked] = useState(false)
  const [messageReply, setMessageReply] = useMessageWithSignature()
  const validateMessage = useValidateMessageWithSignature()
  const [formContainsError, setFormContainsError] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const [attachmentsList, addAttachment, removeAttachment] = useAttachments()
  const { messageID, attachmentFileToAdd } = route.params
  const { sendMessageComplete, sendingMessage, savedDraftID, messagesById, threads, loading, saveDraftComplete, savingDraft, loadingSignature, signature } = useSelector<
    RootState,
    SecureMessagingState
  >((state) => state.secureMessaging)
  const [isTransitionComplete, setIsTransitionComplete] = React.useState(false)
  const [isDiscarded, replyCancelConfirmation] = useComposeCancelConfirmation()

  const message = messagesById?.[messageID]
  const thread = threads?.find((threadIdArray) => threadIdArray.includes(messageID))
  const subject = message ? message.subject : ''
  const category = message ? message.category : 'OTHER'
  // Receiver is the sender of the message user is replying to
  const receiverName = message ? message.senderName : ''
  const receiverID = message?.senderId
  const subjectHeader = formatSubject(category, subject, t)

  const snackbarMessages: SnackbarMessages = {
    successMsg: t('secureMessaging.draft.saved'),
    errorMsg: t('secureMessaging.draft.saved.error'),
  }

  const snackbarSentMessages: SnackbarMessages = {
    successMsg: t('secureMessaging.composeMessage.sent'),
    errorMsg: t('secureMessaging.composeMessage.sent.error'),
  }

  const goToCancel = () => {
    replyCancelConfirmation({
      origin: FormHeaderTypeConstants.reply,
      replyToID: messageID,
      messageData: { body: messageReply },
      isFormValid: true,
    })
  }

  useEffect(() => {
    dispatch(dispatchSetActionStart(DateTime.now().toMillis()))
    if (PREPOPULATE_SIGNATURE && !signature) {
      dispatch(getMessageSignature())
    }
    InteractionManager.runAfterInteractions(() => {
      setIsTransitionComplete(true)
    })
  }, [dispatch, signature])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => (
        <BackButton
          onPress={validateMessage(messageReply) ? goToCancel : navigation.goBack}
          canGoBack={props.canGoBack}
          label={BackButtonLabelConstants.cancel}
          showCarat={false}
        />
      ),
      headerRight: () => (
        <SaveButton
          onSave={() => {
            setOnSaveDraftClicked(true)
            setOnSendClicked(true)
          }}
          disabled={false}
          a11yHint={t('secureMessaging.saveDraft.a11yHint')}
        />
      ),
    })
  })

  useEffect(() => {
    // if a file was just added, update attachmentsList and clear the route params for attachmentFileToAdd
    if (!_.isEmpty(attachmentFileToAdd) && !attachmentsList.includes(attachmentFileToAdd)) {
      addAttachment(attachmentFileToAdd)
      navigation.setParams({ attachmentFileToAdd: {} })
    }
  }, [attachmentFileToAdd, attachmentsList, addAttachment, navigation])

  useEffect(() => {
    if (saveDraftComplete) {
      dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.FOLDERS))
      navigation.navigate('SecureMessaging')
      navigation.navigate('FolderMessages', {
        folderID: SecureMessagingSystemFolderIdConstants.DRAFTS,
        folderName: FolderNameTypeConstants.drafts,
        draftSaved: true,
      })
    }
  }, [saveDraftComplete, navigation, dispatch])

  useEffect(() => {
    // SendMessageComplete variable is tied to send message dispatch function. Once message is sent we want to set that variable to false
    if (sendMessageComplete) {
      dispatch(resetSendMessageComplete())
      dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))
      navigation.navigate('SecureMessaging')
    }
  }, [sendMessageComplete, dispatch, navigation])

  if (loading || savingDraft || loadingSignature || !isTransitionComplete || isDiscarded) {
    const text = savingDraft
      ? t('secureMessaging.formMessage.saveDraft.loading')
      : isDiscarded
      ? t('secureMessaging.deletingChanges.loading')
      : t('secureMessaging.viewMessage.loading')
    return (
      <FullScreenSubtask leftButtonText={tc('cancel')} onLeftButtonPress={navigation.goBack}>
        <LoadingComponent text={text} />
      </FullScreenSubtask>
    )
  }

  if (sendingMessage) {
    return (
      <FullScreenSubtask leftButtonText={tc('cancel')} onLeftButtonPress={navigation.goBack}>
        <LoadingComponent text={t('secureMessaging.formMessage.send.loading')} />
      </FullScreenSubtask>
    )
  }

  const onAddFiles = navigateTo('Attachments', { origin: FormHeaderTypeConstants.reply, attachmentsList, messageID })

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.FormAttachmentsList,
      fieldProps: {
        originHeader: t('secureMessaging.reply'),
        removeOnPress: removeAttachment,
        largeButtonProps:
          attachmentsList.length < theme.dimensions.maxNumMessageAttachments
            ? {
                label: t('secureMessaging.formMessage.addFiles'),
                a11yHint: t('secureMessaging.formMessage.addFiles.a11yHint'),
                onPress: onAddFiles,
              }
            : undefined,
        attachmentsList,
        a11yHint: t('secureMessaging.attachments.howToAttachAFile.a11y'),
      },
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        value: messageReply,
        onChange: setMessageReply,
        labelKey: 'health:secureMessaging.formMessage.message',
        isRequiredField: true,
        isTextArea: true,
        setInputCursorToBeginning: true,
      },
      fieldErrorMessage: t('secureMessaging.formMessage.message.fieldError'),
    },
  ]

  const sendReplyOrSaveDraft = (): void => {
    dispatch(resetSendMessageFailed())
    const messageData = { body: messageReply } as SecureMessagingFormData
    if (savedDraftID) {
      messageData.draft_id = savedDraftID
    }

    if (onSaveDraftClicked) {
      dispatch(saveDraft(messageData, snackbarMessages, savedDraftID, true, messageID))
    } else {
      receiverID && dispatch(sendMessage(messageData, snackbarSentMessages, attachmentsList, messageID))
    }
  }

  const renderForm = (): ReactNode => (
    <Box>
      <MessageAlert scrollViewRef={scrollViewRef} hasValidationError={formContainsError} saveDraftAttempted={onSaveDraftClicked} focusOnError={onSendClicked} />
      <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <CollapsibleView
          text={t('secureMessaging.composeMessage.whenWillIGetAReply')}
          showInTextArea={false}
          a11yHint={t('secureMessaging.composeMessage.whenWillIGetAReplyA11yHint')}>
          <Box {...testIdProps(t('secureMessaging.composeMessage.threeDaysToReceiveResponseA11yLabel'))} mt={theme.dimensions.condensedMarginBetween} accessible={true}>
            <TextView variant="MobileBody">{t('secureMessaging.composeMessage.threeDaysToReceiveResponse')}</TextView>
          </Box>
          <Box {...testIdProps(t('secureMessaging.composeMessage.pleaseCallHealthProviderA11yLabel'))} mt={theme.dimensions.standardMarginBetween} accessible={true}>
            <TextView>
              <TextView variant="MobileBodyBold">{t('secureMessaging.composeMessage.important')}</TextView>
              <TextView variant="MobileBody">{t('secureMessaging.composeMessage.pleaseCallHealthProvider')}</TextView>
            </TextView>
          </Box>
        </CollapsibleView>
      </Box>
      <TextArea>
        <TextView variant="MobileBody" accessible={true}>
          {t('secureMessaging.formMessage.to')}
        </TextView>
        <TextView variant="MobileBodyBold" accessible={true}>
          {receiverName}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} accessible={true}>
          {t('secureMessaging.formMessage.subject')}
        </TextView>
        <TextView variant="MobileBodyBold" accessible={true}>
          {subjectHeader}
        </TextView>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <FormWrapper
            fieldsList={formFieldsList}
            onSave={sendReplyOrSaveDraft}
            onSaveClicked={onSendClicked}
            setOnSaveClicked={setOnSendClicked}
            setFormContainsError={setFormContainsError}
            resetErrors={resetErrors}
            setResetErrors={setResetErrors}
          />
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <VAButton
            label={t('secureMessaging.formMessage.send')}
            onPress={() => {
              setOnSendClicked(true)
              setOnSaveDraftClicked(false)
            }}
            a11yHint={t('secureMessaging.formMessage.send.a11yHint')}
            buttonType={ButtonTypesConstants.buttonPrimary}
          />
        </Box>
      </TextArea>
    </Box>
  )

  const renderMessageThread = (): ReactNode => {
    return (
      <Box>
        <Box accessible={true} accessibilityRole={'header'}>
          <TextView ml={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween} variant={'MobileBodyBold'}>
            {t('secureMessaging.reply.messageConversation')}
          </TextView>
        </Box>
        {message && messagesById && thread && (
          <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
            <Box accessibilityRole={'header'} accessible={true} borderColor={'primary'} borderBottomWidth={'default'} p={theme.dimensions.cardPadding}>
              <TextView variant="BitterBoldHeading">{subjectHeader}</TextView>
            </Box>
            {renderMessages(message, messagesById, thread)}
          </Box>
        )}
      </Box>
    )
  }

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={tc('reply')}
      leftButtonText={tc('cancel')}
      onLeftButtonPress={validateMessage(messageReply) ? goToCancel : navigation.goBack}
      rightButtonText={tc('save')}
      rightVAIconProps={{ name: 'Save' }}
      onRightButtonPress={() => {
        setOnSaveDraftClicked(true)
        setOnSendClicked(true)
      }}
      showCrisisLineCta={true}>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box>{renderForm()}</Box>
        <Box>{renderMessageThread()}</Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default ReplyMessage
