import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { useQueryClient } from '@tanstack/react-query'
import { DateTime } from 'luxon'
import _ from 'underscore'

import {
  secureMessagingKeys,
  useAllMessageRecipients,
  useDeleteMessage,
  useFolderMessages,
  useMessage,
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
  AlertWithHaptics,
  Box,
  ComboBoxItem,
  ComboBoxOptions,
  ErrorComponent,
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
import { MenuViewActionsType } from 'components/Menu'
import { Events } from 'constants/analytics'
import { SecureMessagingErrorCodesConstants } from 'constants/errors'
import { NAMESPACE } from 'constants/namespaces'
import { FolderNameTypeConstants, FormHeaderTypeConstants, REPLY_WINDOW_IN_DAYS } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import {
  useComposeCancelConfirmation,
  useGoToDrafts,
} from 'screens/HealthScreen/SecureMessaging/CancelConfirmations/ComposeCancelConfirmation'
import { renderMessages } from 'screens/HealthScreen/SecureMessaging/ViewMessage/ViewMessageScreen'
import { ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { isErrorObject } from 'utils/common'
import { hasErrorCode } from 'utils/errors'
import { useAttachments, useBeforeNavBackListener, useRouteNavigation, useShowActionSheet, useTheme } from 'utils/hooks'
import {
  RecentRecipient,
  SubjectLengthValidationFn,
  formatSubject,
  getCareSystemPickerOptions,
  getRecentRecipients,
  getStartNewMessageCategoryPickerOptions,
  saveDraftWithAttachmentAlert,
} from 'utils/secureMessaging'
import { screenContentAllowed } from 'utils/waygateConfig'

type EditDraftProps = StackScreenProps<HealthStackParamList, 'EditDraft'>

function EditDraft({ navigation, route }: EditDraftProps) {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const goToDrafts = useGoToDrafts()
  const navigateTo = useRouteNavigation()
  const queryClient = useQueryClient()
  const {
    data: recipientsResponse,
    isFetched: hasLoadedRecipients,
    error: recipientsError,
    refetch: refetchRecipients,
    isFetching: refetchingRecipients,
  } = useAllMessageRecipients({
    enabled: screenContentAllowed('WG_EditDraft'),
  })
  const {
    data: folderMessagesData,
    isFetched: hasLoadedFolderMessages,
    error: folderMessagesError,
    refetch: refetchFolderMessages,
    isFetching: refetchingFolderMessages,
  } = useFolderMessages(SecureMessagingSystemFolderIdConstants.SENT, {
    enabled: screenContentAllowed('WG_FolderMessages'),
  })
  const destructiveAlert = useShowActionSheet()
  const draftAttachmentAlert = useShowActionSheet()
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
  const careSystems = getCareSystemPickerOptions(recipientsResponse?.meta.careSystems || [])
  const recipients = recipientsResponse?.data
  const messageRecipient = recipients?.find((r) => r.id === message?.recipientId?.toString())
  const isReplyDraft = thread.length > 1
  const replyToID = thread?.find((id) => {
    const currentMessage = id.attributes
    return currentMessage?.messageId !== messageID && currentMessage?.senderId !== message?.senderId
  })?.attributes.messageId

  const hasRecentMessages = thread.some(
    (msg) => DateTime.fromISO(msg.attributes.sentDate).diffNow('days').days >= REPLY_WINDOW_IN_DAYS,
  )
  const replyDisabled = isReplyDraft && !hasRecentMessages
  const [careSystem, setCareSystem] = useState(messageRecipient?.attributes.stationNumber || '')
  const [to, setTo] = useState<ComboBoxItem>()
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
      const toRecipientValue = messageRecipient != null ? messageRecipient.attributes.triageTeamId?.toString() : ''
      const toRecipientLabel = messageRecipient != null ? messageRecipient.attributes.name?.toString() : ''
      setBody(message?.body || '')
      setCategory(message?.category || '')
      setSubject(message?.subject || '')
      setCareSystem(messageRecipient?.attributes.stationNumber || '')
      setTo({ value: toRecipientValue, label: toRecipientLabel })
    }
  }, [
    loadingMessage,
    messageFetched,
    message?.body,
    message?.category,
    message?.subject,
    message.recipientId,
    message.recipientName,
    messageRecipient,
  ])

  useEffect(() => {
    if (sendMessageError && isErrorObject(sendMessageErrorDetails)) {
      if (hasErrorCode(SecureMessagingErrorCodesConstants.TRIAGE_ERROR, sendMessageErrorDetails)) {
        setReplyTriageError(true)
      } else {
        const messageData = isReplyDraft
          ? { body, draft_id: messageID, category }
          : {
              recipient_id: parseInt(to?.value || '', 10),
              category,
              body,
              subject,
              draft_id: messageID,
            }
        const mutateOptions = {
          onSuccess: () => {
            snackbar.show(t('secureMessaging.startNewMessage.sent'))
            logAnalyticsEvent(Events.vama_sm_send_message(messageData.category, undefined))
            navigateTo('SecureMessaging', { activeTab: 1 })
          },
        }
        //Currently hardcoding isRecipientOh to false until we have isOhMessage available from draft endpoint
        const params: SendMessageParameters = {
          messageData: messageData,
          uploads: attachmentsList,
          isRecipientOh: false,
        }
        snackbar.show(t('secureMessaging.startNewMessage.sent.error'), {
          isError: true,
          offset: theme.dimensions.snackBarBottomOffset,
          onActionPressed: () => sendMessage(params, mutateOptions),
        })
      }
    }
  }, [
    snackbar,
    t,
    theme,
    sendMessageError,
    sendMessageErrorDetails,
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
      : {
          recipient_id: parseInt(to?.value || '', 10),
          category,
          body,
          subject,
          draft_id: messageID,
        }
  }

  const noRecipientsReceived = !recipients || recipients.length === 0
  const noProviderError = noRecipientsReceived && hasLoadedRecipients

  const draftChanged = (): boolean => {
    if (isReplyDraft) {
      return message?.body !== body
    } else {
      return (
        (message?.recipientId || '').toString() !== to?.value ||
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
    const options = [t('delete'), t('keepEditing')]
    let cancelBtnIndex = 1
    let saveButtonExists = false
    if (!replyDisabled) {
      saveButtonExists = true
      options.splice(1, 0, t('save'))
      cancelBtnIndex = 2
    }

    destructiveAlert(
      {
        options,
        title: t('deleteDraft'),
        message: t('secureMessaging.deleteDraft.deleteInfo'),
        destructiveButtonIndex: 0,
        cancelButtonIndex: cancelBtnIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            const params: DeleteMessageParameters = { messageID: messageID }
            const mutateOptions = {
              onSuccess: () => {
                snackbar.show(t('secureMessaging.deleteDraft.snackBarMessage'))
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
                snackbar.show(t('secureMessaging.deleteDraft.snackBarErrorMessage'), {
                  isError: true,
                  offset: theme.dimensions.snackBarBottomOffset,
                  onActionPressed: () => deleteDraft(params, mutateOptions),
                })
              },
            }
            deleteDraft(params, mutateOptions)
            break
          case 1:
            if (saveButtonExists) {
              setOnSaveDraftClicked(true)
              setOnSendClicked(true)
            }
            break
        }
      },
    )
  }

  const menuViewActions: MenuViewActionsType = []
  if (!replyDisabled) {
    menuViewActions.push({
      actionText: t('save'),
      addDivider: true,
      iconProps: { name: 'Folder', fill: theme.colors.icon.defaultMenuItem },
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
    iconProps: { name: 'Delete', fill: theme.colors.icon.error },
    accessibilityLabel: t('secureMessaging.deleteDraft.menuBtnA11y'),
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

  const handleSetCareSystem = (cs: string) => {
    setCareSystem(cs)
    // Clear to recipient
    setTo(undefined)
  }

  useEffect(() => {
    if (careSystems.length === 1) {
      setCareSystem(careSystems[0].value)
    }
  }, [hasLoadedRecipients, careSystems])

  const onAddFiles = () => {
    logAnalyticsEvent(Events.vama_sm_attach('Add Files'))
    navigateTo('Attachments', { origin: FormHeaderTypeConstants.draft, attachmentsList, messageID })
  }

  const recentRecipients: Array<RecentRecipient> = useMemo(() => {
    return getRecentRecipients(folderMessagesData?.data || [])
  }, [folderMessagesData?.data])

  const getToComboBoxOptions = (): ComboBoxOptions => {
    // filter recipients by selected care system station number
    const careSystemRecipients = _.filter(
      recipients || [],
      (recipient) => recipient.attributes.stationNumber === careSystem,
    )
    const allRecipients = (careSystemRecipients || []).map((recipient) => {
      return {
        label: recipient.attributes.name,
        value: recipient.id,
      }
    })

    // Recent recipients must match
    // 1. Selected care system
    // 2. Included within allRecipients
    const allRecipientsIds = new Set(allRecipients.map((r) => r.value))
    const filteredRecentRecipients = recentRecipients.filter((r) => {
      if (!r.value) return false
      return allRecipientsIds.has(r.value)
    })

    //Filtering out the all recipients list of any recent recipients so as to not have duplicate entries.
    const filteredRecentRecipientsIds = new Set(filteredRecentRecipients.map((r) => r.value))
    const filteredAllRecipients = allRecipients.filter((r) => {
      return !filteredRecentRecipientsIds.has(r.value)
    })

    // not crazy about the keys here being the labels we eventually display in the combobox
    // open to suggestions here
    return {
      [t('secureMessaging.formMessage.recentCareTeams')]: filteredRecentRecipients,
      [t('secureMessaging.formMessage.allCareTeams')]: filteredAllRecipients,
    }
  }

  let formFieldsList: Array<FormFieldType<unknown>> = []
  if (!isReplyDraft) {
    formFieldsList = [
      {
        fieldType: FieldType.Picker,
        fieldProps: {
          labelKey: 'secureMessaging.formMessage.careSystem',
          selectedValue: careSystem,
          onSelectionChange: handleSetCareSystem,
          pickerOptions: careSystems,
          includeBlankPlaceholder: true,
          isRequiredField: true,
          testID: 'care system field',
          confirmTestID: 'careSystemPickerConfirmID',
        },
        hideField: careSystems.length === 1,
        fieldErrorMessage: t('secureMessaging.startNewMessage.careSystem.fieldError'),
      },
      {
        fieldType: FieldType.ComboBox,
        fieldProps: {
          titleKey: 'secureMessaging.formMessage.careTeam',
          labelKey: 'secureMessaging.formMessage.to',
          selectedValue: to,
          onSelectionChange: setTo,
          comboBoxOptions: getToComboBoxOptions(),
          includeBlankPlaceholder: true,
          isRequiredField: true,
          testID: 'editDraftToTestID',
        },
        hideField: !careSystem,
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
        testID: 'messagesAttachmentsAddFilesID',
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

  function isOhMessage(messageData: SecureMessagingFormData): boolean {
    if (isReplyDraft) {
      return message?.isOhMessage || false
    }
    return (
      recipients?.find((recipient) => recipient.attributes.triageTeamId === messageData.recipient_id)?.attributes
        .ohTriageGroup ?? false
    )
  }

  const onMessageSendOrSave = (): void => {
    const messageData = getMessageData()
    if (onSaveDraftClicked) {
      saveDraftWithAttachmentAlert(draftAttachmentAlert, attachmentsList, t, () => {
        const params: SaveDraftParameters = { messageData: messageData, messageID: messageID, replyID: replyToID }
        const mutateOptions = {
          onSuccess: () => {
            snackbar.show(t('secureMessaging.draft.saved'))
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
            snackbar.show(t('secureMessaging.draft.saved.error'), {
              isError: true,
              offset: theme.dimensions.snackBarBottomOffset,
              onActionPressed: () => saveDraft(params, mutateOptions),
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
          queryClient.invalidateQueries({
            queryKey: [secureMessagingKeys.folderMessages, SecureMessagingSystemFolderIdConstants.DRAFTS],
          })
          goToDraftFolder(false)
        },
      }
      const params: SendMessageParameters = {
        messageData: messageData,
        uploads: attachmentsList,
        replyToID: replyToID,
        isRecipientOh: isOhMessage(messageData),
      }

      sendMessage(params, mutateOptions)
    }
  }

  function renderAlert() {
    return (
      <Box my={theme.dimensions.standardMarginBetween}>
        <AlertWithHaptics
          variant="warning"
          header={t('secureMessaging.reply.youCanNoLonger')}
          description={t('secureMessaging.reply.olderThan45Days')}
        />
      </Box>
    )
  }

  function renderForm() {
    if (noProviderError) {
      return (
        <AlertWithHaptics
          variant="error"
          header={t('secureMessaging.startNewMessage.noMatchWithProvider')}
          description={t('secureMessaging.startNewMessage.bothYouAndProviderMustBeEnrolled')}
          descriptionA11yLabel={a11yLabelVA(t('secureMessaging.startNewMessage.bothYouAndProviderMustBeEnrolled'))}
          scrollViewRef={scrollViewRef}>
          <LinkWithAnalytics type="custom" text={t('secureMessaging.goToInbox')} onPress={onGoToInbox} />
        </AlertWithHaptics>
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
              <TextView variant="MobileBodyBold">{subjectHeader}</TextView>
            </Box>
            {renderMessages(message, messageThread)}
          </Box>
        )}
      </Box>
    )
  }

  const hasError = recipientsError || threadError || messageError || folderMessagesError
  const isLoading =
    (!isReplyDraft && !hasLoadedRecipients) ||
    loadingMessage ||
    sendingMessage ||
    savingDraft ||
    deletingDraft ||
    isDiscarded ||
    refetchingRecipients ||
    refetchingThread ||
    !hasLoadedFolderMessages ||
    refetchingFolderMessages

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
      testID="editDraftTestID"
      rightButtonTestID="editDraftMoreID">
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
                  : folderMessagesError
                    ? refetchFolderMessages
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
