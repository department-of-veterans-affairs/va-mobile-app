import { DateTime } from 'luxon'
import { InteractionManager, Pressable, ScrollView } from 'react-native'
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
import { formatSubject, saveDraftWithAttachmentAlert } from 'utils/secureMessaging'
import { renderMessages } from '../ViewMessage/ViewMessageScreen'
import {
  useAppDispatch,
  useAttachments,
  useBeforeNavBackListener,
  useDestructiveActionSheet,
  useMessageWithSignature,
  useRouteNavigation,
  useTheme,
  useValidateMessageWithSignature,
} from 'utils/hooks'
import { useComposeCancelConfirmation } from '../CancelConfirmations/ComposeCancelConfirmation'
import { useSelector } from 'react-redux'

type ReplyMessageProps = StackScreenProps<HealthStackParamList, 'ReplyMessage'>

const ReplyMessage: FC<ReplyMessageProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const dispatch = useAppDispatch()
  const draftAttachmentAlert = useDestructiveActionSheet()

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
  const category = message.category
  // Receiver is the sender of the message user is replying to
  const receiverName = message ? message.senderName : ''
  const receiverID = message?.senderId
  const subjectHeader = formatSubject(category, subject, t)

  const snackbarMessages: SnackbarMessages = {
    successMsg: t('secureMessaging.draft.saved'),
    errorMsg: t('secureMessaging.draft.saved.error'),
  }

  const snackbarSentMessages: SnackbarMessages = {
    successMsg: t('secureMessaging.startNewMessage.sent'),
    errorMsg: t('secureMessaging.startNewMessage.sent.error'),
  }

  const goToCancel = () => {
    replyCancelConfirmation({
      origin: FormHeaderTypeConstants.reply,
      replyToID: messageID,
      messageData: { body: messageReply, category },
      isFormValid: true,
    })
  }

  /**
   * Intercept navigation action before leaving the screen, used the handle OS swipe/hardware back behavior
   */
  useBeforeNavBackListener(navigation, (e) => {
    if (validateMessage(messageReply)) {
      e.preventDefault()
      goToCancel()
    } else {
      navigation.goBack
    }
  })

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
    const messageData = { body: messageReply, category } as SecureMessagingFormData
    if (savedDraftID) {
      messageData.draft_id = savedDraftID
    }

    if (onSaveDraftClicked) {
      saveDraftWithAttachmentAlert(draftAttachmentAlert, attachmentsList, t, () => dispatch(saveDraft(messageData, snackbarMessages, savedDraftID, true, messageID)))
    } else {
      receiverID && dispatch(sendMessage(messageData, snackbarSentMessages, attachmentsList, messageID))
    }
  }

  const renderForm = (): ReactNode => (
    <Box>
      <MessageAlert scrollViewRef={scrollViewRef} hasValidationError={formContainsError} saveDraftAttempted={onSaveDraftClicked} focusOnError={onSendClicked} />
      <TextArea>
        <TextView variant="MobileBody" accessible={true}>
          {t('secureMessaging.formMessage.to')}
        </TextView>
        <TextView variant="MobileBodyBold" accessible={true}>
          {receiverName}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} accessible={true}>
          {t('secureMessaging.startNewMessage.subject')}
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
          <Pressable
            onPress={navigateTo('ReplyHelp')}
            accessibilityRole={'button'}
            accessibilityLabel={tc('secureMessaging.replyHelp.onlyUseMessages')}
            importantForAccessibility={'yes'}>
            <Box pointerEvents={'none'} accessible={false} importantForAccessibility={'no-hide-descendants'}>
              <CollapsibleView text={tc('secureMessaging.replyHelp.onlyUseMessages')} showInTextArea={false} />
            </Box>
          </Pressable>
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
