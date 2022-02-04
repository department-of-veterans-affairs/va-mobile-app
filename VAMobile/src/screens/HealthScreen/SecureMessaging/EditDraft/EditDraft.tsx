import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, ReactNode, useCallback, useEffect, useState } from 'react'
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
import { FolderNameTypeConstants, FormHeaderTypeConstants } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { InteractionManager } from 'react-native'
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
  resetSendMessageFailed,
  saveDraft,
  updateSecureMessagingTab,
} from 'store/slices'
import { formatSubject } from 'utils/secureMessaging'
import { getComposeMessageSubjectPickerOptions } from 'utils/secureMessaging'
import { renderMessages } from '../ViewMessage/ViewMessageScreen'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useAttachments, useDestructiveAlert, useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import { useComposeCancelConfirmation, useGoToDrafts } from '../CancelConfirmations/ComposeCancelConfirmation'
import { useSelector } from 'react-redux'
import MenuView, { MenuViewActionsType } from 'components/Menu'

type EditDraftProps = StackScreenProps<HealthStackParamList, 'EditDraft'>

const EditDraft: FC<EditDraftProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const dispatch = useAppDispatch()
  const goToDrafts = useGoToDrafts()

  const {
    hasLoadedRecipients,
    loading,
    messagesById,
    recipients,
    saveDraftComplete,
    saveDraftFailed,
    savingDraft,
    sendMessageFailed,
    threads,
    deleteDraftComplete,
    deletingDraft,
  } = useSelector<RootState, SecureMessagingState>((state) => state.secureMessaging)
  const destructiveAlert = useDestructiveAlert()
  const [isTransitionComplete, setIsTransitionComplete] = useState(false)

  const { attachmentFileToAdd } = route.params

  const messageID = Number(route.params?.messageID)
  const message = messageID ? messagesById?.[messageID] : null
  const thread = threads?.find((threadIdArray) => threadIdArray.includes(messageID)) || []
  const isReplyDraft = thread.length === 1 ? false : thread.length > 1 ? true : null
  const replyToID = thread?.find((id) => {
    const currentMessage = messagesById?.[id]
    return currentMessage?.messageId !== messageID && currentMessage?.senderId !== message?.senderId
  })

  const [to, setTo] = useState(message?.recipientId?.toString() || '')
  const [category, setCategory] = useState(message?.category || '')
  const [subject, setSubject] = useState(message?.subject || '')
  const [attachmentsList, addAttachment, removeAttachment] = useAttachments()
  const [body, setBody] = useState(message?.body || '')
  const [onSendClicked, setOnSendClicked] = useState(false)
  const [onSaveDraftClicked, setOnSaveDraftClicked] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)

  const editCancelConfirmation = useComposeCancelConfirmation()

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
      title: t('secureMessaging.deleteDraft.areYouSure'),
      message: t('secureMessaging.deleteDraft.deleteInfo'),
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('common:cancel'),
        },
        {
          text: t('common:delete'),
          onPress: () => {
            dispatch(deleteDraft(messageID))
          },
        },
      ],
    })
  }

  const MenViewActions: MenuViewActionsType = [
    {
      actionText: t('common:save'),
      addDivider: true,
      iconName: 'FolderSolid',
      accessibilityLabel: t('secureMessaging.saveDraft.menuBtnA11y'),
      onPress: () => {
        setOnSaveDraftClicked(true)
        setOnSendClicked(true)
      },
    },
    {
      actionText: t('common:delete'),
      addDivider: false,
      iconName: 'TrashSolid',
      accessibilityLabel: t('secureMessaging.deleteDraft.menuBtnA11y'),
      iconColor: 'error',
      textColor: 'error',
      onPress: onDeletePressed,
    },
  ]
  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => (
        <BackButton
          onPress={noProviderError || isFormBlank || !draftChanged() ? () => goToDrafts(false) : goToCancel}
          canGoBack={props.canGoBack}
          label={BackButtonLabelConstants.cancel}
          showCarat={false}
        />
      ),
      headerRight: () => (!noRecipientsReceived || isReplyDraft) && <MenuView actions={MenViewActions} />,
    })
  })

  useEffect(() => {
    // if a file was just added, update attachmentsList and clear the route params for attachmentFileToAdd
    if (!_.isEmpty(attachmentFileToAdd) && !attachmentsList.includes(attachmentFileToAdd)) {
      addAttachment(attachmentFileToAdd)
      navigation.setParams({ attachmentFileToAdd: {} })
    }
  }, [attachmentFileToAdd, attachmentsList, addAttachment, navigation])

  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID} />
  }

  if ((!isReplyDraft && !hasLoadedRecipients) || loading || savingDraft || isReplyDraft === null || !isTransitionComplete || deletingDraft) {
    const text = savingDraft ? t('secureMessaging.formMessage.saveDraft.loading') : deletingDraft ? t('secureMessaging.deleteDraft.loading') : undefined
    return <LoadingComponent text={text} />
  }

  const isFormBlank = !(to || category || subject || attachmentsList.length || body)

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
      dispatch(saveDraft(messageData, messageID, isReplyDraft, replyToID))
    } else {
      // TODO: send along composeType so API knows which endpoint to POST to
      navigation.navigate('SendConfirmation', {
        originHeader: t('secureMessaging.drafts.edit'),
        messageData,
        uploads: attachmentsList,
        replyToID, // any message in the thread that isn't the draft can be replied to
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
            border="error">
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
          <CollapsibleView text={t('secureMessaging.composeMessage.whenWillIGetAReply')} showInTextArea={false}>
            <Box {...testIdProps(t('secureMessaging.composeMessage.threeDaysToReceiveResponseA11yLabel'))} mt={theme.dimensions.condensedMarginBetween} accessible={true}>
              <TextView variant="MobileBody">{t('secureMessaging.composeMessage.threeDaysToReceiveResponse')}</TextView>
            </Box>
            <Box {...testIdProps(t('secureMessaging.composeMessage.pleaseCallHealthProviderA11yLabel'))} mt={theme.dimensions.standardMarginBetween} accessible={true}>
              <TextView>
                <TextView variant="MobileBodyBold" color={'primaryTitle'}>
                  {t('secureMessaging.composeMessage.important')}
                </TextView>
                <TextView variant="MobileBody">{t('secureMessaging.composeMessage.pleaseCallHealthProvider')}</TextView>
              </TextView>
            </Box>
          </CollapsibleView>
        </Box>
        <TextArea>
          {message && isReplyDraft && (
            <>
              <TextView accessible={true}>{t('secureMessaging.formMessage.to')}</TextView>
              <TextView variant="MobileBodyBold" color={'primaryTitle'} accessible={true}>
                {message?.recipientName}
              </TextView>
              <TextView mt={theme.dimensions.standardMarginBetween} accessible={true}>
                {t('secureMessaging.formMessage.subject')}
              </TextView>
              <TextView variant="MobileBodyBold" color={'primaryTitle'} accessible={true}>
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
          <TextView ml={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween} variant={'MobileBodyBold'} color={'primaryTitle'}>
            {t('secureMessaging.reply.messageThread')}
          </TextView>
        </Box>
        {message && messagesById && thread && (
          <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
            <Box accessibilityRole={'header'} accessible={true} borderColor={'primary'} borderBottomWidth={'default'} p={theme.dimensions.cardPadding}>
              <TextView variant="BitterBoldHeading" color={'primaryTitle'}>
                {subjectHeader}
              </TextView>
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
