import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import _ from 'underscore'

import {
  AlertBox,
  Box,
  ButtonTypesConstants,
  CollapsibleView,
  ErrorComponent,
  FieldType,
  FormFieldType,
  FormWrapper,
  FullScreenSubtask,
  LoadingComponent,
  MessageAlert,
  PickerItem,
  TextArea,
  TextView,
  VAButton,
} from 'components'
import { CategoryTypeFields, CategoryTypes, ScreenIDTypesConstants, SecureMessagingFormData, SecureMessagingSystemFolderIdConstants } from 'store/api/types'
import { Events } from 'constants/analytics'
import { FolderNameTypeConstants, FormHeaderTypeConstants, SegmentedControlIndexes } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { InteractionManager, Pressable, ScrollView } from 'react-native'
import { MenuViewActionsType } from 'components/Menu'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import {
  SecureMessagingState,
  deleteDraft,
  dispatchResetDeleteDraftFailed,
  getMessage,
  getMessageRecipients,
  getThread,
  resetSaveDraftFailed,
  resetSendMessageComplete,
  resetSendMessageFailed,
  saveDraft,
  sendMessage,
  updateSecureMessagingTab,
} from 'store/slices'
import { SnackbarMessages } from 'components/SnackBar'
import { SubjectLengthValidationFn, formatSubject, getStartNewMessageCategoryPickerOptions, saveDraftWithAttachmentAlert } from 'utils/secureMessaging'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { renderMessages } from '../ViewMessage/ViewMessageScreen'
import { useAppDispatch, useAttachments, useBeforeNavBackListener, useDestructiveActionSheet, useError, useTheme } from 'utils/hooks'
import { useComposeCancelConfirmation, useGoToDrafts } from '../CancelConfirmations/ComposeCancelConfirmation'

type EditDraftProps = StackScreenProps<HealthStackParamList, 'EditDraft'>

const EditDraft: FC<EditDraftProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const goToDrafts = useGoToDrafts()
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
    sendingMessage,
    sendMessageComplete,
    hasLoadedRecipients,
    loading,
    messagesById,
    recipients,
    saveDraftComplete,
    savingDraft,
    threads,
    deleteDraftComplete,
    deletingDraft,
  } = useSelector<RootState, SecureMessagingState>((state) => state.secureMessaging)
  const destructiveAlert = useDestructiveActionSheet()
  const draftAttachmentAlert = useDestructiveActionSheet()
  const [isTransitionComplete, setIsTransitionComplete] = useState(false)

  const { attachmentFileToAdd } = route.params

  const messageID = Number(route.params?.messageID)
  const message = messageID ? messagesById?.[messageID] : null
  const thread = threads?.find((threadIdArray) => threadIdArray.includes(messageID)) || []
  const isReplyDraft = thread.length > 1
  const replyToID = thread?.find((id) => {
    const currentMessage = messagesById?.[id]
    return currentMessage?.messageId !== messageID && currentMessage?.senderId !== message?.senderId
  })

  const [to, setTo] = useState(message?.recipientId?.toString() || '')
  const [category, setCategory] = useState<CategoryTypes>(message?.category || '')
  const [subject, setSubject] = useState(message?.subject || '')
  const [attachmentsList, addAttachment, removeAttachment] = useAttachments()
  const [body, setBody] = useState(message?.body || '')
  const [onSendClicked, setOnSendClicked] = useState(false)
  const [onSaveDraftClicked, setOnSaveDraftClicked] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)
  const [errorList, setErrorList] = useState<{ [key: number]: string }>([])
  const scrollViewRef = useRef<ScrollView>(null)

  const [isDiscarded, editCancelConfirmation] = useComposeCancelConfirmation()

  const subjectHeader = category ? formatSubject(category as CategoryTypes, subject, t) : ''

  useEffect(() => {
    dispatch(resetSaveDraftFailed())
    dispatch(dispatchResetDeleteDraftFailed())

    if (messageID) {
      dispatch(getMessage(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID, true))
      dispatch(getThread(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID))
    }
    dispatch(getMessageRecipients(ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID))
    InteractionManager.runAfterInteractions(() => {
      setIsTransitionComplete(true)
    })
  }, [messageID, dispatch])

  useEffect(() => {
    if (!loading && message?.body) {
      setBody(message?.body || '')
    }
  }, [loading, message])

  const goToDraftFolder = useCallback(
    (draftSaved: boolean): void => {
      navigation.navigate('FolderMessages', {
        folderID: SecureMessagingSystemFolderIdConstants.DRAFTS,
        folderName: FolderNameTypeConstants.drafts,
        draftSaved,
      })
    },
    [navigation],
  )

  useEffect(() => {
    if (saveDraftComplete) {
      goToDraftFolder(true)
    } else if (deleteDraftComplete) {
      goToDraftFolder(false)
    }
  }, [saveDraftComplete, navigation, deleteDraftComplete, goToDraftFolder, dispatch])

  useEffect(() => {
    // SendMessageComplete variable is tied to send message dispatch function. Once message is sent we want to set that variable to false
    if (sendMessageComplete) {
      dispatch(resetSendMessageComplete())
      navigation.navigate('SecureMessaging')
      navigation.navigate('FolderMessages', {
        folderID: SecureMessagingSystemFolderIdConstants.DRAFTS,
        folderName: FolderNameTypeConstants.drafts,
        draftSaved: false,
      })
    }
  }, [sendMessageComplete, dispatch, navigation])

  const noRecipientsReceived = !recipients || recipients.length === 0
  const noProviderError = noRecipientsReceived && hasLoadedRecipients

  const draftChanged = (): boolean => {
    if (isReplyDraft) {
      return message?.body !== body
    } else {
      return message?.recipientId?.toString() !== to || message?.category !== category || message?.subject !== subject || message?.body !== body
    }
  }

  const getMessageData = (): SecureMessagingFormData => {
    return isReplyDraft ? { body, draft_id: messageID, category } : { recipient_id: parseInt(to, 10), category, body, subject, draft_id: messageID }
  }

  const goToCancel = (): void => {
    const isFormValid = isReplyDraft ? !!message : !!(to && category && message && (category !== CategoryTypeFields.other || subject))

    editCancelConfirmation({
      draftMessageID: messageID,
      isFormValid,
      messageData: getMessageData(),
      origin: FormHeaderTypeConstants.draft,
      replyToID,
    })
  }

  const onDeletePressed = (): void => {
    destructiveAlert({
      title: t('deleteDraft'),
      message: t('secureMessaging.deleteDraft.deleteInfo'),
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('keepEditing'),
        },
        {
          text: t('delete'),
          onPress: () => {
            dispatch(deleteDraft(messageID, snackbarMessages))
          },
        },
        {
          text: t('save'),
          onPress: () => {
            setOnSaveDraftClicked(true)
            setOnSendClicked(true)
          },
        },
      ],
    })
  }

  const MenViewActions: MenuViewActionsType = [
    {
      actionText: t('save'),
      addDivider: true,
      iconName: 'Folder',
      accessibilityLabel: t('secureMessaging.saveDraft'),
      onPress: () => {
        setOnSaveDraftClicked(true)
        setOnSendClicked(true)
      },
    },
    {
      actionText: t('delete'),
      addDivider: false,
      iconName: 'Trash',
      accessibilityLabel: t('secureMessaging.deleteDraft.menuBtnA11y'),
      iconColor: 'error',
      textColor: 'error',
      onPress: onDeletePressed,
    },
  ]

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

  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID)) {
    return (
      <FullScreenSubtask title={t('editDraft')} leftButtonText={t('cancel')} menuViewActions={MenViewActions} scrollViewRef={scrollViewRef}>
        <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID} />
      </FullScreenSubtask>
    )
  }

  if ((!isReplyDraft && !hasLoadedRecipients) || loading || savingDraft || !isTransitionComplete || deletingDraft || isDiscarded) {
    const text = savingDraft
      ? t('secureMessaging.formMessage.saveDraft.loading')
      : deletingDraft
      ? t('secureMessaging.deleteDraft.loading')
      : isDiscarded
      ? t('secureMessaging.deletingChanges.loading')
      : t('secureMessaging.draft.loading')
    return (
      <FullScreenSubtask
        leftButtonText={t('cancel')}
        onLeftButtonPress={() => {
          goToDrafts(false)
        }}
        scrollViewRef={scrollViewRef}>
        <LoadingComponent text={text} />
      </FullScreenSubtask>
    )
  }

  if (sendingMessage) {
    return (
      <FullScreenSubtask
        leftButtonText={t('cancel')}
        onLeftButtonPress={() => {
          goToDrafts(false)
        }}
        scrollViewRef={scrollViewRef}>
        <LoadingComponent text={t('secureMessaging.formMessage.send.loading')} />
      </FullScreenSubtask>
    )
  }

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
    navigation.navigate('Attachments', { origin: FormHeaderTypeConstants.draft, attachmentsList, messageID })
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
        largeButtonProps:
          attachmentsList.length < theme.dimensions.maxNumMessageAttachments
            ? {
                label: t('secureMessaging.formMessage.addFiles'),
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
    dispatch(resetSendMessageFailed())
    dispatch(updateSecureMessagingTab(SegmentedControlIndexes.INBOX))
    navigation.navigate('SecureMessaging')
  }

  const onMessageSendOrSave = (): void => {
    dispatch(resetSendMessageFailed())
    const messageData = getMessageData()

    if (onSaveDraftClicked) {
      saveDraftWithAttachmentAlert(draftAttachmentAlert, attachmentsList, t, () => dispatch(saveDraft(messageData, saveSnackbarMessages, messageID, isReplyDraft, replyToID, true)))
    } else {
      // TODO: send along composeType so API knows which endpoint to POST to
      dispatch(sendMessage(messageData, snackbarSentMessages, attachmentsList, replyToID))
    }
  }

  const renderForm = (): ReactNode => {
    if (noProviderError) {
      return (
        <AlertBox
          title={t('secureMessaging.startNewMessage.noMatchWithProvider')}
          text={t('secureMessaging.startNewMessage.bothYouAndProviderMustBeEnrolled')}
          textA11yLabel={a11yLabelVA(t('secureMessaging.startNewMessage.bothYouAndProviderMustBeEnrolled'))}
          border="error"
          scrollViewRef={scrollViewRef}>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VAButton label={t('secureMessaging.goToInbox')} onPress={onGoToInbox} buttonType={ButtonTypesConstants.buttonPrimary} />
          </Box>
        </AlertBox>
      )
    }

    const navigateToReplyHelp = () => {
      logAnalyticsEvent(Events.vama_sm_nonurgent())
      navigation.navigate('ReplyHelp')
    }

    return (
      <Box>
        <MessageAlert
          hasValidationError={formContainsError}
          saveDraftAttempted={onSaveDraftClicked}
          scrollViewRef={scrollViewRef}
          focusOnError={onSendClicked}
          errorList={errorList}
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
            <Pressable
              onPress={navigateToReplyHelp}
              accessibilityRole={'button'}
              accessibilityLabel={t('secureMessaging.replyHelp.onlyUseMessages')}
              importantForAccessibility={'yes'}>
              <Box pointerEvents={'none'} accessible={false} importantForAccessibility={'no-hide-descendants'}>
                <CollapsibleView text={t('secureMessaging.replyHelp.onlyUseMessages')} showInTextArea={false} />
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
              buttonType={ButtonTypesConstants.buttonPrimary}
            />
          </Box>
        </TextArea>
      </Box>
    )
  }

  const renderMessageThread = (): ReactNode => {
    let messageThread = thread || []

    // If we're editing a reply draft, don't display the draft message in the thread
    if (isReplyDraft) {
      messageThread = messageThread?.filter((id) => id !== messageID)
    }

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
            {renderMessages(message, messagesById, messageThread)}
          </Box>
        )}
      </Box>
    )
  }

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={t('editDraft')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={noProviderError || isFormBlank || !draftChanged() ? () => goToDrafts(false) : goToCancel}
      menuViewActions={MenViewActions}
      showCrisisLineCta={true}
      leftButtonTestID="editDraftCancelTestID"
      testID="editDraftTestID">
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box>{renderForm()}</Box>
        <Box>{isReplyDraft && renderMessageThread()}</Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default EditDraft
