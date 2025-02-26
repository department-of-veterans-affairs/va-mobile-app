import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { useQueryClient } from '@tanstack/react-query'
import _ from 'underscore'

import {
  secureMessagingKeys,
  useMessageRecipients,
  useMessageSignature,
  useSaveDraft,
  useSendMessage,
} from 'api/secureMessaging'
import {
  CategoryTypeFields,
  CategoryTypes,
  SaveDraftParameters,
  SecureMessagingFormData,
  SecureMessagingSystemFolderIdConstants,
  SendMessageParameters,
} from 'api/types'
import {
  AlertWithHaptics,
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
import { SnackbarMessages } from 'components/SnackBar'
import { Events } from 'constants/analytics'
import { SecureMessagingErrorCodesConstants } from 'constants/errors'
import { NAMESPACE } from 'constants/namespaces'
import { FolderNameTypeConstants, FormHeaderTypeConstants, PREPOPULATE_SIGNATURE } from 'constants/secureMessaging'
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
  useMessageWithSignature,
  useRouteNavigation,
  useTheme,
  useValidateMessageWithSignature,
} from 'utils/hooks'
import {
  SubjectLengthValidationFn,
  getStartNewMessageCategoryPickerOptions,
  saveDraftWithAttachmentAlert,
} from 'utils/secureMessaging'
import { screenContentAllowed } from 'utils/waygateConfig'

import { useComposeCancelConfirmation } from '../CancelConfirmations/ComposeCancelConfirmation'

type StartNewMessageProps = StackScreenProps<HealthStackParamList, 'StartNewMessage'>

function StartNewMessage({ navigation, route }: StartNewMessageProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const draftAttachmentAlert = useDestructiveActionSheet()
  const navigateTo = useRouteNavigation()
  const queryClient = useQueryClient()

  const snackbarMessages: SnackbarMessages = {
    successMsg: t('secureMessaging.draft.saved'),
    errorMsg: t('secureMessaging.draft.saved.error'),
  }

  const snackbarSentMessages: SnackbarMessages = {
    successMsg: t('secureMessaging.startNewMessage.sent'),
    errorMsg: t('secureMessaging.startNewMessage.sent.error'),
  }

  const { mutate: saveDraft, isPending: savingDraft } = useSaveDraft()
  const {
    mutate: sendMessage,
    isPending: sendingMessage,
    isError: sendMessageError,
    error: sendMessageErrorDetails,
  } = useSendMessage()
  const { attachmentFileToAdd, saveDraftConfirmFailed } = route.params
  const {
    data: recipients,
    isFetched: hasLoadedRecipients,
    error: recipientsError,
    refetch: refetchRecipients,
    isFetching: refetchingRecipients,
  } = useMessageRecipients({
    enabled: screenContentAllowed('WG_StartNewMessage'),
  })
  const {
    data: signature,
    isFetched: signatureFetched,
    error: signatureError,
    refetch: refetchSignature,
    isFetching: refetchingSignature,
  } = useMessageSignature({
    enabled: PREPOPULATE_SIGNATURE && screenContentAllowed('WG_StartNewMessage'),
  })
  const [to, setTo] = useState('')
  const [category, setCategory] = useState('')
  const [subject, setSubject] = useState('')
  const [replyTriageError, setReplyTriageError] = useState(false)
  const [attachmentsList, addAttachment, removeAttachment] = useAttachments()
  const [message, setMessage] = useMessageWithSignature(signature, signatureFetched)
  const validateMessage = useValidateMessageWithSignature()
  const [onSendClicked, setOnSendClicked] = useState(false)
  const [onSaveDraftClicked, setOnSaveDraftClicked] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)
  const [errorList, setErrorList] = useState<{ [key: number]: string }>([])
  const scrollViewRef = useRef<ScrollView>(null)
  const [isDiscarded, composeCancelConfirmation] = useComposeCancelConfirmation()

  const messageData = {
    recipient_id: parseInt(to, 10),
    category: category as CategoryTypes,
    body: message,
    subject,
  } as SecureMessagingFormData
  // Ref for use in snackbar callbacks to ensure we have the latest messageData
  const messageDataRef = useRef<SecureMessagingFormData>(messageData)
  messageDataRef.current = messageData

  const noRecipientsReceived = !recipients || recipients.length === 0
  const noProviderError = noRecipientsReceived && hasLoadedRecipients

  const goToCancel = () => {
    composeCancelConfirmation({
      origin: FormHeaderTypeConstants.compose,
      draftMessageID: undefined,
      messageData,
      isFormValid,
    })
  }
  useEffect(() => {
    if (!saveDraftConfirmFailed) {
      return
    }
    setOnSaveDraftClicked(true)
    setOnSendClicked(true)
  }, [saveDraftConfirmFailed])

  /**
   * Intercept navigation action before leaving the screen, used the handle OS swipe/hardware back behavior
   */
  useBeforeNavBackListener(navigation, (e) => {
    if (isDiscarded) {
      return
    } else if (!noProviderError && !isFormBlank) {
      e.preventDefault()
      goToCancel()
    } else {
      navigation.goBack
    }
  })

  useEffect(() => {
    if (attachmentFileToAdd === undefined) {
      return
    }
    // if a file was just added, update attachmentsList and clear the route params for attachmentFileToAdd
    if (!_.isEmpty(attachmentFileToAdd) && !attachmentsList.includes(attachmentFileToAdd)) {
      addAttachment(attachmentFileToAdd)
      navigation.setParams({ attachmentFileToAdd: {} })
    }
  }, [attachmentFileToAdd, attachmentsList, addAttachment, navigation])

  const isFormBlank = !(to || category || subject || attachmentsList.length || validateMessage(message, signature))
  const isFormValid = !!(
    to &&
    category &&
    validateMessage(message, signature) &&
    (category !== CategoryTypeFields.other || subject)
  )

  const isSetToGeneral = (text: string): boolean => {
    return text === CategoryTypeFields.other // Value of option associated with picker label 'General'
  }

  const onCategoryChange = (newCategory: string): void => {
    logAnalyticsEvent(Events.vama_sm_change_category(newCategory as CategoryTypes, category as CategoryTypes))
    setCategory(newCategory)

    // Only "General" category requires a subject, reset errors changing away to clear potential subject error
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
    navigateTo('Attachments', { origin: FormHeaderTypeConstants.compose, attachmentsList })
  }
  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        labelKey: 'secureMessaging.formMessage.to',
        selectedValue: to,
        onSelectionChange: setTo,
        pickerOptions: getToPickerOptions(),
        includeBlankPlaceholder: true,
        isRequiredField: true,
        testID: 'to field',
        confirmTestID: 'messagePickerConfirmID',
      },
      fieldErrorMessage: t('secureMessaging.startNewMessage.to.fieldError'),
    },
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        labelKey: 'secureMessaging.startNewMessage.category',
        selectedValue: category,
        onSelectionChange: onCategoryChange,
        pickerOptions: getStartNewMessageCategoryPickerOptions(t),
        includeBlankPlaceholder: true,
        isRequiredField: true,
        testID: 'picker',
        confirmTestID: 'messagePickerConfirmID',
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
        testID: 'startNewMessageSubjectTestID',
      },
      fieldErrorMessage: t('secureMessaging.startNewMessage.subject.fieldEmpty'),
      validationList: [
        {
          validationFunction: SubjectLengthValidationFn(subject),
          validationFunctionErrorMessage: t('secureMessaging.startNewMessage.subject.tooManyCharacters'),
        },
      ],
    },
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
        value: message,
        onChange: setMessage,
        labelKey: 'secureMessaging.formMessage.message',
        isRequiredField: true,
        isTextArea: true,
        setInputCursorToBeginning: true,
        testID: 'message field',
      },
      fieldErrorMessage: t('secureMessaging.formMessage.message.fieldError'),
    },
  ]

  const onGoToInbox = (): void => {
    navigateTo('SecureMessaging', { activeTab: 0 })
  }

  const onMessageSendOrSave = (): void => {
    if (onSaveDraftClicked) {
      saveDraftWithAttachmentAlert(draftAttachmentAlert, attachmentsList, t, () => {
        const params: SaveDraftParameters = { messageData: messageData }
        const mutateOptions = {
          onSuccess: () => {
            showSnackBar(snackbarMessages.successMsg, dispatch, undefined, true, false, true)
            logAnalyticsEvent(Events.vama_sm_save_draft(messageData.category))
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
            showSnackBar(
              snackbarMessages.errorMsg,
              dispatch,
              // passing messageDataRef to ensure we have the latest messageData
              () => saveDraft({ messageData: messageDataRef.current }, mutateOptions),
              false,
              true,
            )
          },
        }
        saveDraft(params, mutateOptions)
      })
    } else {
      const mutateOptions = {
        onSuccess: () => {
          showSnackBar(snackbarSentMessages.successMsg, dispatch, undefined, true, false, true)
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
            showSnackBar(
              snackbarSentMessages.errorMsg,
              dispatch,
              // passing messageDataRef to ensure we have the latest messageData
              () => sendMessage({ messageData: messageDataRef.current, uploads: attachmentsList }, mutateOptions),
              false,
              true,
            )
          }
        },
      }
      const params: SendMessageParameters = { messageData: messageData, uploads: attachmentsList }
      sendMessage(params, mutateOptions)
    }
  }

  function renderContent() {
    if (noProviderError) {
      return (
        <AlertWithHaptics
          variant="error"
          header={t('secureMessaging.startNewMessage.noMatchWithProvider')}
          description={t('secureMessaging.startNewMessage.bothYouAndProviderMustBeEnrolled')}
          descriptionA11yLabel={a11yLabelVA(t('secureMessaging.startNewMessage.bothYouAndProviderMustBeEnrolled'))}>
          <LinkWithAnalytics type="custom" text={t('secureMessaging.goToInbox')} onPress={onGoToInbox} />
        </AlertWithHaptics>
      )
    }

    const navigateToReplyHelp = () => {
      logAnalyticsEvent(Events.vama_sm_nonurgent())
      navigateTo('ReplyHelp')
    }

    return (
      <Box>
        <Box mb={theme.dimensions.standardMarginBetween}>
          <AlertWithHaptics
            variant="info"
            header={t('secureMessaging.startNewMessage.nonurgent.title')}
            headerA11yLabel={a11yLabelVA(t('appointments.appointmentsStatusSomeUnavailable'))}
            scrollViewRef={scrollViewRef}>
            <TextView variant="MobileBody">
              {t('secureMessaging.startNewMessage.nonurgent.careTeam')}
              <TextView variant="MobileBodyBold">
                {t('secureMessaging.startNewMessage.nonurgent.threeDays')}
              </TextView>{' '}
              {t('secureMessaging.startNewMessage.nonurgent.reply')}
            </TextView>
          </AlertWithHaptics>
        </Box>
        <MessageAlert
          hasValidationError={formContainsError}
          saveDraftAttempted={onSaveDraftClicked}
          scrollViewRef={scrollViewRef}
          focusOnError={onSendClicked}
          errorList={errorList}
          replyTriageError={replyTriageError}
        />
        <TextArea>
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
          <Box mt={theme.dimensions.standardMarginBetween}>
            <LinkWithAnalytics
              type="custom"
              text={t('secureMessaging.replyHelp.onlyUseMessages')}
              onPress={navigateToReplyHelp}
              testID="startNewMessageOnlyUseMessagesTestID"
            />
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <Button
              label={t('secureMessaging.formMessage.send')}
              onPress={() => {
                setOnSendClicked(true)
                setOnSaveDraftClicked(false)
              }}
            />
          </Box>
        </TextArea>
      </Box>
    )
  }

  const hasError = recipientsError || signatureError
  const isLoading =
    !hasLoadedRecipients ||
    savingDraft ||
    !signatureFetched ||
    isDiscarded ||
    sendingMessage ||
    refetchingRecipients ||
    refetchingSignature
  const loadingText = savingDraft
    ? t('secureMessaging.formMessage.saveDraft.loading')
    : isDiscarded
      ? t('secureMessaging.deleteDraft.loading')
      : sendingMessage
        ? t('secureMessaging.formMessage.send.loading')
        : t('secureMessaging.formMessage.startNewMessage.loading')

  const rightButtonProps =
    noProviderError || isLoading || hasError
      ? undefined
      : {
          rightButtonText: t('save'),
          onRightButtonPress: () => {
            setOnSaveDraftClicked(true)
            setOnSendClicked(true)
          },
          rightButtonTestID: 'startNewMessageSaveTestID',
        }

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={isLoading || hasError ? '' : t('secureMessaging.startNewMessage')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}
      {...rightButtonProps}
      showCrisisLineButton={!(isLoading || hasError)}
      testID="startNewMessageTestID"
      leftButtonTestID="startNewMessageCancelTestID">
      {isLoading ? (
        <LoadingComponent text={loadingText} />
      ) : hasError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID}
          error={recipientsError || signatureError}
          onTryAgain={recipientsError ? refetchRecipients : signatureError ? refetchSignature : undefined}
        />
      ) : (
        <Box mb={theme.dimensions.contentMarginBottom}>{renderContent()}</Box>
      )}
    </FullScreenSubtask>
  )
}

export default StartNewMessage
