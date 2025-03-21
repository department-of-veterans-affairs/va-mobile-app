import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { useQueryClient } from '@tanstack/react-query'
import _ from 'underscore'

import {
  secureMessagingKeys,
  useMessage,
  useMessageSignature,
  useSaveDraft,
  useSendMessage,
  useThread,
} from 'api/secureMessaging'
import {
  SaveDraftParameters,
  SecureMessagingAttachment,
  SecureMessagingFormData,
  SecureMessagingMessageAttributes,
  SecureMessagingMessageList,
  SecureMessagingSystemFolderIdConstants,
  SendMessageParameters,
} from 'api/types'
import {
  Box,
  FieldType,
  FormFieldType,
  FormWrapper,
  FullScreenSubtask,
  LinkWithAnalytics,
  LoadingComponent,
  MessageAlert,
  TextArea,
  TextView,
} from 'components'
import { Events } from 'constants/analytics'
import { SecureMessagingErrorCodesConstants } from 'constants/errors'
import { NAMESPACE } from 'constants/namespaces'
import { FolderNameTypeConstants, FormHeaderTypeConstants, PREPOPULATE_SIGNATURE } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { logAnalyticsEvent } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { hasErrorCode } from 'utils/errors'
import {
  useAttachments,
  useBeforeNavBackListener,
  useDestructiveActionSheet,
  useMessageWithSignature,
  useRouteNavigation,
  useTheme,
  useValidateMessageWithSignature,
} from 'utils/hooks'
import { formatSubject, saveDraftWithAttachmentAlert } from 'utils/secureMessaging'

import { useComposeCancelConfirmation } from '../CancelConfirmations/ComposeCancelConfirmation'
import { renderMessages } from '../ViewMessage/ViewMessageScreen'

type ReplyMessageProps = StackScreenProps<HealthStackParamList, 'ReplyMessage'>

function ReplyMessage({ navigation, route }: ReplyMessageProps) {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const draftAttachmentAlert = useDestructiveActionSheet()
  const navigateTo = useRouteNavigation()
  const queryClient = useQueryClient()

  const [onSendClicked, setOnSendClicked] = useState(false)
  const [onSaveDraftClicked, setOnSaveDraftClicked] = useState(false)
  const validateMessage = useValidateMessageWithSignature()
  const [formContainsError, setFormContainsError] = useState(false)
  const [replyTriageError, setReplyTriageError] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)
  const [errorList, setErrorList] = useState<{ [key: number]: string }>([])
  const scrollViewRef = useRef<ScrollView>(null)
  const [attachmentsList, addAttachment, removeAttachment] = useAttachments()
  const { messageID, attachmentFileToAdd, saveDraftConfirmFailed } = route.params
  const { mutate: saveDraft, isPending: savingDraft } = useSaveDraft()
  const {
    mutate: sendMessage,
    isPending: sendingMessage,
    isError: sendMessageError,
    error: sendMessageErrorDetails,
  } = useSendMessage()
  const { data: signature, isFetched: signatureFetched } = useMessageSignature({
    enabled: PREPOPULATE_SIGNATURE,
  })
  const [messageReply, setMessageReply] = useMessageWithSignature(signature, signatureFetched)
  const [isDiscarded, replyCancelConfirmation] = useComposeCancelConfirmation()
  const { data: threadData } = useThread(messageID, false)
  const { data: messageReplyData, isLoading: loadingMessage } = useMessage(messageID)
  const thread = threadData?.data || ([] as SecureMessagingMessageList)
  const message = messageReplyData?.data.attributes || ({} as SecureMessagingMessageAttributes)
  const includedAttachments = messageReplyData?.included?.filter((included) => included.type === 'attachments')
  if (includedAttachments?.length) {
    const attachments: Array<SecureMessagingAttachment> = includedAttachments.map((attachment) => ({
      id: attachment.id,
      filename: attachment.attributes.name,
      link: attachment.links.download,
      size: attachment.attributes.attachmentSize,
    }))

    message.attachments = attachments
  }
  const subject = message ? message.subject : ''
  const category = message.category
  // Receiver is the sender of the message user is replying to
  const receiverName = message ? message.senderName : ''
  const receiverID = message?.senderId
  const subjectHeader = formatSubject(category, subject, t)

  const messageData = {
    body: messageReply,
    category: category,
    subject: subject,
    recipient_id: receiverID,
  } as SecureMessagingFormData
  // Ref for use in snackbar callbacks to ensure we have the latest messageData
  const messageDataRef = useRef<SecureMessagingFormData>(messageData)
  messageDataRef.current = messageData

  const goToCancel = () => {
    replyCancelConfirmation({
      origin: FormHeaderTypeConstants.reply,
      replyToID: message.messageId,
      messageData: { body: messageReply, category },
      isFormValid,
    })
  }

  useEffect(() => {
    if (saveDraftConfirmFailed) {
      setOnSaveDraftClicked(true)
      setOnSendClicked(true)
    }
  }, [saveDraftConfirmFailed])

  /**
   * Intercept navigation action before leaving the screen, used the handle OS swipe/hardware back behavior
   */
  useBeforeNavBackListener(navigation, (e) => {
    if (isFormBlank) {
      navigation.goBack
    } else {
      e.preventDefault()
      goToCancel()
    }
  })

  useEffect(() => {
    // if a file was just added, update attachmentsList and clear the route params for attachmentFileToAdd
    if (!_.isEmpty(attachmentFileToAdd) && !attachmentsList.includes(attachmentFileToAdd)) {
      addAttachment(attachmentFileToAdd)
      navigation.setParams({ attachmentFileToAdd: {} })
    }
  }, [attachmentFileToAdd, attachmentsList, addAttachment, navigation])

  const isFormBlank = !(attachmentsList.length || validateMessage(messageReply, signature))
  const isFormValid = validateMessage(messageReply, signature)

  const onAddFiles = () => {
    logAnalyticsEvent(Events.vama_sm_attach('Add Files'))
    navigateTo('Attachments', { origin: FormHeaderTypeConstants.reply, attachmentsList, messageID })
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.FormAttachmentsList,
      fieldProps: {
        removeOnPress: removeAttachment,
        buttonLabel:
          attachmentsList.length < theme.dimensions.maxNumMessageAttachments
            ? t('secureMessaging.formMessage.addFiles')
            : undefined,
        buttonPress: attachmentsList.length < theme.dimensions.maxNumMessageAttachments ? onAddFiles : undefined,
        attachmentsList,
        testID: 'messagesAttachmentsAddFilesID',
      },
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        value: messageReply,
        onChange: setMessageReply,
        labelKey: 'secureMessaging.formMessage.message',
        isRequiredField: true,
        isTextArea: true,
        setInputCursorToBeginning: true,
        testID: 'reply field',
      },
      fieldErrorMessage: t('secureMessaging.formMessage.message.fieldError'),
    },
  ]

  const sendReplyOrSaveDraft = (): void => {
    const reducedMessageData = { body: messageReply, category } as SecureMessagingFormData
    if (onSaveDraftClicked) {
      saveDraftWithAttachmentAlert(draftAttachmentAlert, attachmentsList, t, () => {
        const params: SaveDraftParameters = { messageData: reducedMessageData, replyID: message.messageId }
        const mutateOptions = {
          onSuccess: () => {
            snackbar.show(t('secureMessaging.draft.saved'))
            logAnalyticsEvent(Events.vama_sm_save_draft(reducedMessageData.category))
            queryClient.invalidateQueries({
              queryKey: [secureMessagingKeys.folderMessages, SecureMessagingSystemFolderIdConstants.DRAFTS],
            })
            navigateTo('SecureMessaging', { activeTab: 1 })
            navigateTo('FolderMessages', {
              folderID: SecureMessagingSystemFolderIdConstants.DRAFTS,
              folderName: FolderNameTypeConstants.drafts,
              draftSaved: true,
            })
          },
          onError: () => {
            snackbar.show(t('secureMessaging.draft.saved.error'), {
              isError: true,
              offset: theme.dimensions.snackBarBottomOffset,
              onActionPressed: () =>
                saveDraft(
                  {
                    // passing messageDataRef to ensure we have the latest messageData
                    messageData: {
                      body: messageDataRef.current.body,
                      category: messageDataRef.current.category,
                    },
                    replyID: message.messageId,
                  },
                  mutateOptions,
                ),
            })
          },
        }
        saveDraft(params, mutateOptions)
      })
    } else {
      const mutateOptions = {
        onSuccess: () => {
          snackbar.show(t('secureMessaging.startNewMessage.sent'))
          logAnalyticsEvent(Events.vama_sm_send_message(messageData.category, undefined))
          navigateTo('SecureMessaging', { activeTab: 0 })
        },
        onError: () => {
          if (
            sendMessageError &&
            isErrorObject(sendMessageErrorDetails) &&
            hasErrorCode(SecureMessagingErrorCodesConstants.TRIAGE_ERROR, sendMessageErrorDetails)
          ) {
            setReplyTriageError(true)
          } else {
            snackbar.show(t('secureMessaging.startNewMessage.sent.error'), {
              isError: true,
              offset: theme.dimensions.snackBarBottomOffset,
              onActionPressed: () =>
                sendMessage(
                  {
                    // passing messageDataRef to ensure we have the latest messageData
                    messageData: messageDataRef.current,
                    uploads: attachmentsList,
                    replyToID: message.messageId,
                  },
                  mutateOptions,
                ),
            })
          }
        },
      }
      const params: SendMessageParameters = {
        messageData: messageData,
        uploads: attachmentsList,
        replyToID: message.messageId,
      }
      receiverID && sendMessage(params, mutateOptions)
    }
  }

  const navigateToReplyHelp = () => {
    logAnalyticsEvent(Events.vama_sm_nonurgent())
    navigateTo('ReplyHelp')
  }

  function renderForm() {
    return (
      <Box>
        <MessageAlert
          scrollViewRef={scrollViewRef}
          hasValidationError={formContainsError}
          saveDraftAttempted={onSaveDraftClicked}
          focusOnError={onSendClicked}
          errorList={errorList}
          replyTriageError={replyTriageError}
        />
        <TextArea>
          <TextView variant="MobileBody" accessible={true} testID={'To ' + receiverName}>
            {t('secureMessaging.formMessage.to')}
          </TextView>
          <TextView variant="MobileBodyBold" accessible={true}>
            {receiverName}
          </TextView>
          <TextView
            variant="MobileBody"
            mt={theme.dimensions.standardMarginBetween}
            accessible={true}
            testID={'Subject ' + subjectHeader}>
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
              setErrorList={setErrorList}
            />
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <LinkWithAnalytics
              type="custom"
              text={t('secureMessaging.replyHelp.onlyUseMessages')}
              onPress={navigateToReplyHelp}
            />
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <Button
              label={t('secureMessaging.formMessage.send')}
              onPress={() => {
                setOnSendClicked(true)
                setOnSaveDraftClicked(false)
              }}
              testID="sendButtonTestID"
            />
          </Box>
        </TextArea>
      </Box>
    )
  }
  function renderMessageThread() {
    return (
      <Box>
        <Box accessible={true} accessibilityRole={'header'}>
          <TextView ml={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween} variant={'MobileBodyBold'}>
            {t('secureMessaging.reply.messageConversation')}
          </TextView>
        </Box>
        {message && thread && (
          <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
            <Box
              accessibilityRole={'header'}
              accessible={true}
              borderColor={'primary'}
              borderBottomWidth={'default'}
              p={theme.dimensions.cardPadding}>
              <TextView variant="MobileBodyBold">{subjectHeader}</TextView>
            </Box>
            {renderMessages(message, thread)}
          </Box>
        )}
      </Box>
    )
  }

  const isLoading = loadingMessage || savingDraft || !signatureFetched || isDiscarded || sendingMessage
  const loadingText = savingDraft
    ? t('secureMessaging.formMessage.saveDraft.loading')
    : isDiscarded
      ? t('secureMessaging.deletingChanges.loading')
      : sendingMessage
        ? t('secureMessaging.formMessage.send.loading')
        : t('secureMessaging.viewMessage.loading')

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={isLoading ? '' : t('reply')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={!isLoading && validateMessage(messageReply, signature) ? goToCancel : navigation.goBack}
      rightButtonText={isLoading ? '' : t('save')}
      onRightButtonPress={() => {
        setOnSaveDraftClicked(true)
        setOnSendClicked(true)
      }}
      showCrisisLineButton={!isLoading}
      testID="replyPageTestID">
      {isLoading ? (
        <LoadingComponent text={loadingText} />
      ) : (
        <Box mb={theme.dimensions.contentMarginBottom}>
          <Box>{renderForm()}</Box>
          <Box>{renderMessageThread()}</Box>
        </Box>
      )}
    </FullScreenSubtask>
  )
}

export default ReplyMessage
