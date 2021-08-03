import React, { FC, ReactNode, useEffect, useState } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'underscore'

import {
  AlertBox,
  BackButton,
  Box,
  ButtonTypesConstants,
  CollapsibleView,
  CrisisLineCta,
  ErrorComponent,
  FieldType,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  MessageAlert,
  PickerItem,
  SaveButton,
  TextArea,
  TextView,
  VAButton,
  VAScrollView,
} from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import {
  CategoryTypeFields,
  CategoryTypes,
  ScreenIDTypesConstants,
  SecureMessagingFormData,
  SecureMessagingSystemFolderIdConstants,
  SecureMessagingTabTypesConstants,
} from 'store/api/types'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { FolderNameTypeConstants, FormHeaderTypeConstants } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { formatSubject } from 'utils/secureMessaging'
import { getComposeMessageSubjectPickerOptions } from 'utils/secureMessaging'
import { getMessage, getMessageRecipients, getThread, resetSaveDraftFailed, resetSendMessageFailed, saveDraft, updateSecureMessagingTab } from 'store/actions'
import { renderMessages } from '../ViewMessage/ViewMessageScreen'
import { testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type EditDraftProps = StackScreenProps<HealthStackParamList, 'EditDraft'>

const EditDraft: FC<EditDraftProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const dispatch = useDispatch()

  const { hasLoadedRecipients, loading, messagesById, recipients, saveDraftComplete, saveDraftFailed, savingDraft, sendMessageFailed, threads } = useSelector<
    StoreState,
    SecureMessagingState
  >((state) => state.secureMessaging)

  const { attachmentFileToAdd, attachmentFileToRemove } = route.params

  const messageID = Number(route.params?.messageID)
  const message = messageID ? messagesById?.[messageID] : null

  const [to, setTo] = useState(message?.recipientId?.toString() || '')
  const [category, setCategory] = useState(message?.category || '')
  const [subject, setSubject] = useState(message?.subject || '')
  const [attachmentsList, setAttachmentsList] = useState<Array<ImagePickerResponse | DocumentPickerResponse>>([])
  const [body, setBody] = useState(message?.body || '')
  const [onSendClicked, setOnSendClicked] = useState(false)
  const [onSaveDraftClicked, setOnSaveDraftClicked] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)
  const [isReplyDraft, setIsReplyDraft] = useState<boolean | null>(null)
  const [thread, setThread] = useState(threads?.find((threadIdArray) => threadIdArray.includes(messageID)) || [])

  const subjectHeader = category ? formatSubject(category as CategoryTypes, subject, t) : ''

  useEffect(() => {
    dispatch(resetSaveDraftFailed())

    if (messageID) {
      dispatch(getMessage(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID))
      dispatch(getThread(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID))
    }
    dispatch(getMessageRecipients(ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID))
  }, [messageID, dispatch])

  useEffect(() => {
    if (!loading) {
      setBody(message?.body || '')
    }

    const replyThread = threads?.find((threadIdArray) => threadIdArray.includes(messageID))

    if (replyThread) {
      setThread(replyThread)
      setIsReplyDraft(replyThread.length > 1)
    }
  }, [loading, message, messageID, dispatch, threads])

  useEffect(() => {
    if (saveDraftComplete) {
      navigation.navigate('FolderMessages', {
        folderID: SecureMessagingSystemFolderIdConstants.DRAFTS,
        folderName: FolderNameTypeConstants.drafts,
        draftSaved: true,
      })
    }
  }, [saveDraftComplete, navigation])

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
    return isReplyDraft ? { body, draft_id: messageID } : { recipient_id: parseInt(to, 10), category: category as CategoryTypes, body, subject, draft_id: messageID }
  }

  const goToCancel = (): void => {
    const isFormValid = isReplyDraft ? !!message : !!(to && category && message && (category !== CategoryTypeFields.other || subject))

    navigation.navigate('ComposeCancelConfirmation', {
      draftMessageID: messageID,
      isFormValid,
      messageData: getMessageData(),
      origin: FormHeaderTypeConstants.draft,
      replyToID: thread?.length > 0 ? thread?.filter((id) => id !== messageID)?.[0] : undefined,
    })
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton
          onPress={noProviderError || isFormBlank || !draftChanged() ? navigation.goBack : goToCancel}
          canGoBack={props.canGoBack}
          label={BackButtonLabelConstants.cancel}
          showCarat={false}
        />
      ),
      headerRight: () =>
        (!noRecipientsReceived || isReplyDraft) && (
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
      setAttachmentsList([...attachmentsList, attachmentFileToAdd])
      navigation.setParams({ attachmentFileToAdd: {} })
    }
  }, [attachmentFileToAdd, attachmentsList, setAttachmentsList, navigation])

  useEffect(() => {
    // if a file was just specified to be removed, update attachmentsList and clear the route params for attachmentFileToRemove
    if (!_.isEmpty(attachmentFileToRemove) && attachmentsList.includes(attachmentFileToRemove)) {
      setAttachmentsList(attachmentsList.filter((item) => item !== attachmentFileToRemove))
      navigation.setParams({ attachmentFileToRemove: {} })
    }
  }, [attachmentFileToRemove, attachmentsList, setAttachmentsList, navigation])

  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID} />
  }

  if ((!isReplyDraft && !hasLoadedRecipients) || loading || savingDraft || isReplyDraft === null) {
    const text = savingDraft ? t('secureMessaging.formMessage.saveDraft.loading') : undefined
    return <LoadingComponent text={text} />
  }

  const isFormBlank = !(to || category || subject || attachmentsList.length || body)

  const removeAttachment = (attachmentFile: ImagePickerResponse | DocumentPickerResponse): void => {
    navigation.navigate('RemoveAttachment', { origin: FormHeaderTypeConstants.draft, attachmentFileToRemove: attachmentFile, messageID })
  }

  const isSetToGeneral = (text: string): boolean => {
    return text === CategoryTypeFields.other // Value of option associated with picker label 'General'
  }

  const onCategoryChange = (newCategory: string): void => {
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

  const onAddFiles = navigateTo('Attachments', { origin: FormHeaderTypeConstants.draft, attachmentsList, messageID })

  let formFieldsList: Array<FormFieldType<unknown>> = []

  if (!isReplyDraft) {
    formFieldsList = [
      {
        fieldType: FieldType.Picker,
        fieldProps: {
          labelKey: 'health:secureMessaging.formMessage.to',
          selectedValue: to,
          onSelectionChange: setTo,
          pickerOptions: getToPickerOptions(),
          includeBlankPlaceholder: true,
          isRequiredField: true,
        },
        fieldErrorMessage: t('secureMessaging.composeMessage.to.fieldError'),
      },
      {
        fieldType: FieldType.Picker,
        fieldProps: {
          labelKey: 'health:secureMessaging.formMessage.subject',
          selectedValue: category,
          onSelectionChange: onCategoryChange,
          pickerOptions: getComposeMessageSubjectPickerOptions(t),
          includeBlankPlaceholder: true,
          isRequiredField: true,
        },
        fieldErrorMessage: t('secureMessaging.composeMessage.subject.fieldError'),
      },
      {
        fieldType: FieldType.TextInput,
        fieldProps: {
          inputType: 'none',
          labelKey: 'health:secureMessaging.composeMessage.subjectLine',
          value: subject,
          onChange: setSubject,
          helperTextKey: 'health:secureMessaging.composeMessage.subjectLine.helperText',
          maxLength: 50,
          isRequiredField: category === CategoryTypeFields.other,
        },
        fieldErrorMessage: t('secureMessaging.composeMessage.subjectLine.fieldError'),
      },
    ]
  }

  formFieldsList = [
    ...formFieldsList,
    {
      fieldType: FieldType.FormAttachmentsList,
      fieldProps: {
        originHeader: t('secureMessaging.drafts.edit'),
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
        value: body,
        onChange: setBody,
        labelKey: 'health:secureMessaging.formMessage.message',
        isRequiredField: true,
        isTextArea: true,
      },
      fieldErrorMessage: t('secureMessaging.formMessage.message.fieldError'),
    },
  ]

  const onGoToInbox = (): void => {
    dispatch(resetSendMessageFailed())
    dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))
    navigation.navigate('SecureMessaging')
  }

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const onMessageSendOrSave = (): void => {
    dispatch(resetSendMessageFailed())
    const messageData = getMessageData()

    if (onSaveDraftClicked) {
      dispatch(saveDraft(messageData, messageID, isReplyDraft))
    } else {
      // TODO: send along composeType so API knows which endpoint to POST to
      navigation.navigate('SendConfirmation', {
        originHeader: t('secureMessaging.drafts.edit'),
        messageData,
        uploads: attachmentsList,
        replyToID: thread?.find((x) => x !== messageID), // any message in the thread that isn't the draft can be replied to
      })
    }
  }

  const renderForm = (): ReactNode => {
    if (noProviderError) {
      return (
        <Box mx={theme.dimensions.gutter}>
          <AlertBox
            title={t('secureMessaging.composeMessage.noMatchWithProvider')}
            text={t('secureMessaging.composeMessage.bothYouAndProviderMustBeEnrolled')}
            textA11yLabel={t('secureMessaging.composeMessage.bothYouAndProviderMustBeEnrolledA11yLabel')}
            border="error"
            background="noCardBackground">
            <Box mt={theme.dimensions.standardMarginBetween}>
              <VAButton label={t('secureMessaging.goToInbox')} onPress={onGoToInbox} buttonType={ButtonTypesConstants.buttonPrimary} />
            </Box>
          </AlertBox>
        </Box>
      )
    }

    return (
      <Box>
        <MessageAlert
          hasValidationError={formContainsError}
          saveDraftAttempted={onSaveDraftClicked}
          saveDraftFailed={saveDraftFailed}
          savingDraft={savingDraft}
          sendMessageFailed={sendMessageFailed}
        />
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
          {message && isReplyDraft && (
            <>
              <TextView accessible={true}>{t('secureMessaging.formMessage.to')}</TextView>
              <TextView variant="MobileBodyBold" accessible={true}>
                {message?.senderName}
              </TextView>
              <TextView mt={theme.dimensions.standardMarginBetween} accessible={true}>
                {t('secureMessaging.formMessage.subject')}
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
            {t('secureMessaging.reply.messageThread')}
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
    <VAScrollView {...testIdProps('Compose-message-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box>{renderForm()}</Box>
        <Box>{isReplyDraft && renderMessageThread()}</Box>
      </Box>
    </VAScrollView>
  )
}

export default EditDraft
