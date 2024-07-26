import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import _ from 'underscore'

import {
  secureMessagingKeys,
  useDeleteMessage,
  useMessage,
  useMessageRecipients,
  useSaveDraft,
  useSendMessage,
  useThread,
} from 'api/secureMessaging'
import {
  CategoryTypeFields,
  CategoryTypes,
  DeleteMessageParameters,
  SaveDraftParameters,
  SecureMessagingFormData,
  SecureMessagingMessageAttributes,
  SecureMessagingMessageList,
  SecureMessagingSystemFolderIdConstants,
  SendMessageParameters,
} from 'api/types'
import {
  AlertBox,
  Box,
  ErrorComponent,
  FieldType,
  FormFieldType,
  FormWrapper,
  FullScreenSubtask,
  LinkWithAnalytics,
  LoadingComponent,
  MessageAlert,
  PickerItem,
  TextArea,
  TextView,
} from 'components'
import { MenuViewActionsType } from 'components/Menu'
import { SnackbarMessages } from 'components/SnackBar'
import { Events } from 'constants/analytics'
import { SecureMessagingErrorCodesConstants } from 'constants/errors'
import { NAMESPACE } from 'constants/namespaces'
import { FolderNameTypeConstants, FormHeaderTypeConstants, REPLY_WINDOW_IN_DAYS } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { isErrorObject, showSnackBar } from 'utils/common'
import { hasErrorCode } from 'utils/errors'
import {
  useAppDispatch,
  useAttachments,
  useBeforeNavBackListener,
  useDestructiveActionSheet,
  useRouteNavigation,
  useTheme,
} from 'utils/hooks'
import {
  SubjectLengthValidationFn,
  formatSubject,
  getStartNewMessageCategoryPickerOptions,
  saveDraftWithAttachmentAlert,
} from 'utils/secureMessaging'
import { screenContentAllowed } from 'utils/waygateConfig'

import { useComposeCancelConfirmation, useGoToDrafts } from '../CancelConfirmations/ComposeCancelConfirmation'
import { renderMessages } from '../ViewMessage/ViewMessageScreen'

type EditDraftProps = StackScreenProps<HealthStackParamList, 'EditDraft'>

function EditDraft({ navigation, route }: EditDraftProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const goToDrafts = useGoToDrafts()
  const navigateTo = useRouteNavigation()
  const queryClient = useQueryClient()
  const snackbarMessages: SnackbarMessages = {
    successMsg: t('secureMessaging.deleteDraft.snackBarMessage'),
    errorMsg: t('secureMessaging.deleteDraft.snackBarErrorMessage'),
  }
  const saveSnackbarMessages: SnackbarMessages = {
    successMsg: t('secureMessaging.draft.saved'),
    errorMsg: t('secureMessaging.draft.saved.error'),
  }

  const snackbarSentMessages: SnackbarMessages = {
    successMsg: t('secureMessaging.startNewMessage.sent'),
    errorMsg: t('secureMessaging.startNewMessage.sent.error'),
  }

  const {
    data: recipients,
    isFetched: hasLoadedRecipients,
    error: recipientsError,
    refetch: refetchRecipients,
    isFetching: refetchingRecipients,
  } = useMessageRecipients({
    enabled: screenContentAllowed('WG_EditDraft'),
  })
  const destructiveAlert = useDestructiveActionSheet()
  const draftAttachmentAlert = useDestructiveActionSheet()
  const { mutate: saveDraft, isPending: savingDraft } = useSaveDraft()
  const { mutate: deleteDraft, isPending: deletingDraft } = useDeleteMessage()
  const {
    mutate: sendMessage,
    isPending: sendingMessage,
    isError: sendMessageError,
    error: sendMessageErrorDetails,
  } = useSendMessage()
  const { attachmentFileToAdd } = route.params

  const messageID = Number(route.params?.messageID)
  const {
    data: messageDraftData,
    isFetching: loadingMessage,
    isFetched: messageFetched,
    error: messageError,
    refetch: refetchMessage,
  } = useMessage(messageID, {
    enabled: screenContentAllowed('WG_EditDraft'),
  })
  const {
    data: threadData,
    error: threadError,
    refetch: refetchThread,
    isFetching: refetchingThread,
  } = useThread(messageID, false, {
    enabled: screenContentAllowed('WG_EditDraft'),
  })
  const thread = threadData?.data || ([] as SecureMessagingMessageList)
  const message = messageDraftData?.data.attributes || ({} as SecureMessagingMessageAttributes)
  const isReplyDraft = thread.length > 1
  const replyToID = thread?.find((id) => {
    const currentMessage = id.attributes
    return currentMessage?.messageId !== messageID && currentMessage?.senderId !== message?.senderId
  })?.attributes.messageId

  const hasRecentMessages = thread.some(
    (msg) => DateTime.fromISO(msg.attributes.sentDate).diffNow('days').days >= REPLY_WINDOW_IN_DAYS,
  )
  const replyDisabled = isReplyDraft && !hasRecentMessages

  const [to, setTo] = useState((message?.recipientId || '').toString())
  const [category, setCategory] = useState<CategoryTypes>(message?.category || '')
  const [subject, setSubject] = useState(message?.subject || '')
  const [attachmentsList, addAttachment, removeAttachment] = useAttachments()
  const [body, setBody] = useState(message?.body || '')
  const [onSendClicked, setOnSendClicked] = useState(false)
  const [replyTriageError, setReplyTriageError] = useState(false)
  const [onSaveDraftClicked, setOnSaveDraftClicked] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)
  const [errorList, setErrorList] = useState<{ [key: number]: string }>([])
  const scrollViewRef = useRef<ScrollView>(null)

  const [isDiscarded, editCancelConfirmation] = useComposeCancelConfirmation()

  const subjectHeader = category ? formatSubject(category as CategoryTypes, subject, t) : ''

  const goToDraftFolder = useCallback(
    (draftSaved: boolean): void => {
      navigateTo('FolderMessages', {
        folderID: SecureMessagingSystemFolderIdConstants.DRAFTS,
        folderName: FolderNameTypeConstants.drafts,
        draftSaved,
      })
    },
    [navigateTo],
  )

  useEffect(() => {
    if (!loadingMessage && messageFetched) {
      setBody(message?.body || '')
      setCategory(message?.category || '')
      setSubject(message?.subject || '')
      setTo((message?.recipientId || '').toString())
    }
  }, [loadingMessage, messageFetched, message.body, message.category, message.subject, message.recipientId])

  useEffect(() => {
    if (sendMessageError && isErrorObject(sendMessageErrorDetails)) {
      if (hasErrorCode(SecureMessagingErrorCodesConstants.TRIAGE_ERROR, sendMessageErrorDetails)) {
        setReplyTriageError(true)
      } else {
        const messageData = isReplyDraft
          ? { body, draft_id: messageID, category }
          : { recipient_id: parseInt(to, 10), category, body, subject, draft_id: messageID }
        const mutateOptions = {
          onSuccess: () => {
            showSnackBar(snackbarSentMessages.successMsg, dispatch, undefined, true, false, true)
            logAnalyticsEvent(Events.vama_sm_send_message(messageData.category, undefined))
            navigateTo('SecureMessaging', { activeTab: 1 })
          },
        }
        const params: SendMessageParameters = { messageData: messageData, uploads: attachmentsList }
        showSnackBar(snackbarSentMessages.errorMsg, dispatch, () => sendMessage(params, mutateOptions), false, true)
      }
    }
  }, [
    dispatch,
    sendMessageError,
    sendMessageErrorDetails,
    snackbarSentMessages.successMsg,
    snackbarSentMessages.errorMsg,
    attachmentsList,
    category,
    messageID,
    to,
    subject,
    body,
    isReplyDraft,
    navigateTo,
    sendMessage,
    setReplyTriageError,
  ])

  const getMessageData = (): SecureMessagingFormData => {
    return isReplyDraft
      ? { body, draft_id: messageID, category }
      : { recipient_id: parseInt(to, 10), category, body, subject, draft_id: messageID }
  }

  const noRecipientsReceived = !recipients || recipients.length === 0
  const noProviderError = noRecipientsReceived && hasLoadedRecipients

  const draftChanged = (): boolean => {
    if (isReplyDraft) {
      return message?.body !== body
    } else {
      return (
        (message?.recipientId || '').toString() !== to ||
        message?.category !== category ||
        message?.subject !== subject ||
        message?.body !== body
      )
    }
  }

  const goToCancel = (): void => {
    const isFormValid = isReplyDraft
      ? !!message
      : !!(to && category && message && (category !== CategoryTypeFields.other || subject))

    editCancelConfirmation({
      draftMessageID: messageID,
      isFormValid,
      messageData: getMessageData(),
      origin: FormHeaderTypeConstants.draft,
      replyToID,
    })
  }

  const onDeletePressed = (): void => {
    const buttons = [
      {
        text: t('keepEditing'),
      },
      {
        text: t('delete'),
        onPress: () => {
          const params: DeleteMessageParameters = { messageID: messageID }
          const mutateOptions = {
            onSuccess: () => {
              showSnackBar(snackbarMessages.successMsg, dispatch, undefined, true, false, true)
              queryClient.invalidateQueries({
                queryKey: [secureMessagingKeys.folderMessages, SecureMessagingSystemFolderIdConstants.DRAFTS],
              })
              navigateTo('FolderMessages', {
                folderID: SecureMessagingSystemFolderIdConstants.DRAFTS,
                folderName: FolderNameTypeConstants.drafts,
                draftSaved: false,
              })
              goToDraftFolder(false)
            },
            onError: () => {
              showSnackBar(snackbarMessages.errorMsg, dispatch, () => deleteDraft(params, mutateOptions), false, true)
            },
          }
          deleteDraft(params, mutateOptions)
        },
      },
    ]

    if (!replyDisabled) {
      buttons.push({
        text: t('save'),
        onPress: () => {
          setOnSaveDraftClicked(true)
          setOnSendClicked(true)
        },
      })
    }

    destructiveAlert({
      title: t('deleteDraft'),
      message: t('secureMessaging.deleteDraft.deleteInfo'),
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      buttons,
    })
  }

  const menuViewActions: MenuViewActionsType = []
  if (!replyDisabled) {
    menuViewActions.push({
      actionText: t('save'),
      addDivider: true,
      iconName: 'Folder',
      accessibilityLabel: t('secureMessaging.saveDraft'),
      onPress: () => {
        setOnSaveDraftClicked(true)
        setOnSendClicked(true)
      },
    })
  }
  menuViewActions.push({
    actionText: t('delete'),
    addDivider: false,
    iconName: 'Trash',
    accessibilityLabel: t('secureMessaging.deleteDraft.menuBtnA11y'),
    iconColor: 'error',
    textColor: 'error',
    onPress: onDeletePressed,
  })

  /**
   * Intercept navigation action before leaving the screen, used the handle OS swipe/hardware back behavior
   */
  useBeforeNavBackListener(navigation, (e) => {
    if (noProviderError || isFormBlank || !draftChanged()) {
      goToDrafts(false)
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

  const isFormBlank = !(to || category || subject || attachmentsList.length || body)

  const isSetToGeneral = (text: CategoryTypes): boolean => {
    return text === CategoryTypeFields.other // Value of option associated with picker label 'General'
  }

  const onCategoryChange = (newCategory: CategoryTypes): void => {
    logAnalyticsEvent(Events.vama_sm_change_category(newCategory, category))
    setCategory(newCategory)

    // if the category used to be general and now its not, clear field errors because the category line is now
    // no longer a required field
    if (isSetToGeneral(category) && !isSetToGeneral(newCategory)) {
      setResetErrors(true)
    }
  }

  const getToPickerOptions = (): Array<PickerItem> => {
    return (recipients || []).map((recipient) => {
      return {
        label: recipient.attributes.name,
        value: recipient.id,
      }
    })
  }

  const onAddFiles = () => {
    logAnalyticsEvent(Events.vama_sm_attach('Add Files'))
    navigateTo('Attachments', { origin: FormHeaderTypeConstants.draft, attachmentsList, messageID })
  }

  let formFieldsList: Array<FormFieldType<unknown>> = []

  if (!isReplyDraft) {
    formFieldsList = [
      {
        fieldType: FieldType.Picker,
        fieldProps: {
          labelKey: 'secureMessaging.formMessage.to',
          selectedValue: to,
          onSelectionChange: setTo,
          pickerOptions: getToPickerOptions(),
          includeBlankPlaceholder: true,
          isRequiredField: true,
          testID: 'editDraftToTestID',
        },
        fieldErrorMessage: t('secureMessaging.startNewMessage.to.fieldError'),
      },
      {
        fieldType: FieldType.Picker,
        fieldProps: {
          labelKey: 'secureMessaging.startNewMessage.category',
          selectedValue: category,
          onSelectionChange: onCategoryChange as () => string,
          pickerOptions: getStartNewMessageCategoryPickerOptions(t),
          includeBlankPlaceholder: true,
          isRequiredField: true,
          testID: 'editDraftCategoryTestID',
        },
        fieldErrorMessage: t('secureMessaging.startNewMessage.category.fieldError'),
      },
      {
        fieldType: FieldType.TextInput,
        fieldProps: {
          inputType: 'none',
          labelKey: 'secureMessaging.startNewMessage.subject',
          value: subject,
          onChange: setSubject,
          helperTextKey: 'secureMessaging.startNewMessage.subject.helperText',
          isRequiredField: category === CategoryTypeFields.other,
          testID: 'editDraftSubjectTestID',
        },
        fieldErrorMessage: t('secureMessaging.startNewMessage.subject.fieldEmpty'),
        validationList: [
          {
            validationFunction: SubjectLengthValidationFn(subject),
            validationFunctionErrorMessage: t('secureMessaging.startNewMessage.subject.tooManyCharacters'),
          },
        ],
      },
    ]
  }

  formFieldsList = [
    ...formFieldsList,
    {
      fieldType: FieldType.FormAttachmentsList,
      fieldProps: {
        removeOnPress: removeAttachment,
        buttonLabel:
          attachmentsList.length < theme.dimensions.maxNumMessageAttachments && !replyDisabled
            ? t('secureMessaging.formMessage.addFiles')
            : undefined,
        buttonPress: attachmentsList.length < theme.dimensions.maxNumMessageAttachments ? onAddFiles : undefined,
        attachmentsList,
      },
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        value: body,
        onChange: setBody,
        labelKey: 'secureMessaging.formMessage.message',
        isRequiredField: true,
        isTextArea: true,
        testID: 'messageText',
      },
      fieldErrorMessage: t('secureMessaging.formMessage.message.fieldError'),
    },
  ]

  const onGoToInbox = (): void => {
    navigateTo('SecureMessaging', { activeTab: 0 })
  }

  const onMessageSendOrSave = (): void => {
    const messageData = getMessageData()
    if (onSaveDraftClicked) {
      saveDraftWithAttachmentAlert(draftAttachmentAlert, attachmentsList, t, () => {
        const params: SaveDraftParameters = { messageData: messageData, messageID: messageID, replyID: replyToID }
        const mutateOptions = {
          onSuccess: () => {
            showSnackBar(saveSnackbarMessages.successMsg, dispatch, undefined, true, false, true)
            logAnalyticsEvent(Events.vama_sm_save_draft(messageData.category))
            queryClient.invalidateQueries({
              queryKey: [secureMessagingKeys.message, messageID],
            })
            queryClient.invalidateQueries({
              queryKey: [secureMessagingKeys.folderMessages, SecureMessagingSystemFolderIdConstants.DRAFTS],
            })
            goToDraftFolder(true)
          },
          onError: () => {
            showSnackBar(saveSnackbarMessages.errorMsg, dispatch, () => saveDraft(params, mutateOptions), false, true)
          },
        }
        saveDraft(params, mutateOptions)
      })
    } else {
      const mutateOptions = {
        onSuccess: () => {
          showSnackBar(snackbarSentMessages.successMsg, dispatch, undefined, true, false, true)
          logAnalyticsEvent(Events.vama_sm_send_message(messageData.category, undefined))
          queryClient.invalidateQueries({
            queryKey: [secureMessagingKeys.folderMessages, SecureMessagingSystemFolderIdConstants.DRAFTS],
          })
          goToDraftFolder(false)
        },
      }
      const params: SendMessageParameters = { messageData: messageData, uploads: attachmentsList, replyToID: replyToID }
      sendMessage(params, mutateOptions)
    }
  }

  function renderAlert() {
    return (
      <Box my={theme.dimensions.standardMarginBetween}>
        <AlertBox border={'warning'} title={t('secureMessaging.reply.youCanNoLonger')}>
          <TextView mt={theme.dimensions.standardMarginBetween} variant="MobileBody">
            {t('secureMessaging.reply.olderThan45Days')}
          </TextView>
        </AlertBox>
      </Box>
    )
  }

  function renderForm() {
    if (noProviderError) {
      return (
        <AlertBox
          title={t('secureMessaging.startNewMessage.noMatchWithProvider')}
          text={t('secureMessaging.startNewMessage.bothYouAndProviderMustBeEnrolled')}
          textA11yLabel={a11yLabelVA(t('secureMessaging.startNewMessage.bothYouAndProviderMustBeEnrolled'))}
          border="error"
          scrollViewRef={scrollViewRef}>
          <LinkWithAnalytics type="custom" text={t('secureMessaging.goToInbox')} onPress={onGoToInbox} />
        </AlertBox>
      )
    }

    const navigateToReplyHelp = () => {
      logAnalyticsEvent(Events.vama_sm_nonurgent())
      navigateTo('ReplyHelp')
    }

    const renderButton = () => {
      return (
        <Box mt={theme.dimensions.standardMarginBetween}>
          <Button
            label={t('secureMessaging.formMessage.send')}
            onPress={() => {
              setOnSendClicked(true)
              setOnSaveDraftClicked(false)
            }}
          />
        </Box>
      )
    }

    return (
      <Box>
        <MessageAlert
          hasValidationError={formContainsError}
          saveDraftAttempted={onSaveDraftClicked}
          scrollViewRef={scrollViewRef}
          focusOnError={onSendClicked}
          errorList={errorList}
          replyTriageError={replyTriageError}
        />
        <TextArea>
          {message && isReplyDraft && (
            <>
              <TextView accessible={true}>{t('secureMessaging.formMessage.to')}</TextView>
              <TextView variant="MobileBodyBold" accessible={true}>
                {message?.recipientName}
              </TextView>
              <TextView mt={theme.dimensions.standardMarginBetween} accessible={true}>
                {t('secureMessaging.startNewMessage.subject')}
              </TextView>
              <TextView variant="MobileBodyBold" accessible={true}>
                {subjectHeader}
              </TextView>
            </>
          )}
          <Box mt={isReplyDraft ? theme.dimensions.standardMarginBetween : 0}>
            <FormWrapper
              fieldsList={formFieldsList}
              onSave={onMessageSendOrSave}
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
          {!replyDisabled && renderButton()}
        </TextArea>
      </Box>
    )
  }

  function renderMessageThread() {
    let messageThread = thread || []

    // If we're editing a reply draft, don't display the draft message in the thread
    if (isReplyDraft) {
      messageThread = messageThread?.filter((id) => id.attributes.messageId !== messageID)
    }

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
              <TextView variant="BitterBoldHeading">{subjectHeader}</TextView>
            </Box>
            {renderMessages(message, messageThread)}
          </Box>
        )}
      </Box>
    )
  }

  const hasError = recipientsError || threadError || messageError
  const isLoading =
    (!isReplyDraft && !hasLoadedRecipients) ||
    loadingMessage ||
    sendingMessage ||
    savingDraft ||
    deletingDraft ||
    isDiscarded ||
    refetchingRecipients ||
    refetchingThread

  const loadingText = savingDraft
    ? t('secureMessaging.formMessage.saveDraft.loading')
    : sendingMessage
      ? t('secureMessaging.formMessage.send.loading')
      : deletingDraft
        ? t('secureMessaging.deleteDraft.loading')
        : isDiscarded
          ? t('secureMessaging.deletingChanges.loading')
          : t('secureMessaging.draft.loading')
  const leftButtonAction = noProviderError || isFormBlank || !draftChanged() ? () => goToDrafts(false) : goToCancel

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={isLoading ? '' : t('editDraft')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={isLoading ? undefined : leftButtonAction}
      menuViewActions={isLoading ? undefined : menuViewActions}
      showCrisisLineButton={!(isLoading || hasError)}
      leftButtonTestID="editDraftCancelTestID"
      testID="editDraftTestID">
      {isLoading ? (
        <LoadingComponent text={loadingText} />
      ) : hasError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID}
          error={recipientsError || threadError || messageError}
          onTryAgain={
            recipientsError
              ? refetchRecipients
              : threadError
                ? refetchThread
                : messageError
                  ? refetchMessage
                  : undefined
          }
        />
      ) : (
        <Box mb={theme.dimensions.contentMarginBottom}>
          {replyDisabled && renderAlert()}
          <Box>{renderForm()}</Box>
          <Box>{isReplyDraft && renderMessageThread()}</Box>
        </Box>
      )}
    </FullScreenSubtask>
  )
}

export default EditDraft
