import { InteractionManager } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, ReactNode, useEffect, useState } from 'react'
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
import { FolderNameTypeConstants, FormHeaderTypeConstants } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { getComposeMessageSubjectPickerOptions } from 'utils/secureMessaging'
import { getMessageRecipients, getMessageSignature, resetSendMessageFailed, saveDraft, updateSecureMessagingTab } from 'store/slices/secureMessagingSlice'
import { testIdProps } from 'utils/accessibility'
import {
  useAppDispatch,
  useAppSelector,
  useAttachments,
  useError,
  useMessageWithSignature,
  useRouteNavigation,
  useTheme,
  useTranslation,
  useValidateMessageWithSignature,
} from 'utils/hooks'
import { useComposeCancelConfirmation } from '../CancelConfirmations/ComposeCancelConfirmation'

type ComposeMessageProps = StackScreenProps<HealthStackParamList, 'ComposeMessage'>

const ComposeMessage: FC<ComposeMessageProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const dispatch = useAppDispatch()

  const { savedDraftID, recipients, hasLoadedRecipients, saveDraftComplete, saveDraftFailed, savingDraft, sendMessageFailed, loadingSignature, signature } = useAppSelector(
    (state) => state.secureMessaging,
  )
  const { attachmentFileToAdd, saveDraftConfirmFailed } = route.params

  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [subjectLine, setSubjectLine] = useState('')
  const [attachmentsList, addAttachment, removeAttachment] = useAttachments()
  const [message, setMessage] = useMessageWithSignature()
  const validateMessage = useValidateMessageWithSignature()
  const [onSendClicked, setOnSendClicked] = useState(false)
  const [onSaveDraftClicked, setOnSaveDraftClicked] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)
  const [isTransitionComplete, setIsTransitionComplete] = React.useState(false)

  const composeCancelConfirmation = useComposeCancelConfirmation()

  useEffect(() => {
    dispatch(getMessageRecipients(ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID))

    if (!signature) {
      dispatch(getMessageSignature())
    }
    InteractionManager.runAfterInteractions(() => {
      setIsTransitionComplete(true)
    })
  }, [dispatch, signature])

  const noRecipientsReceived = !recipients || recipients.length === 0
  const noProviderError = noRecipientsReceived && hasLoadedRecipients

  const goToCancel = () => {
    const messageData = { recipient_id: parseInt(to, 10), category: subject as CategoryTypes, body: message, subject: subjectLine } as SecureMessagingFormData
    composeCancelConfirmation({ origin: FormHeaderTypeConstants.compose, draftMessageID: savedDraftID, messageData, isFormValid })
  }
  useEffect(() => {
    if (!saveDraftConfirmFailed) {
      return
    }
    setOnSaveDraftClicked(true)
    setOnSendClicked(true)
  }, [saveDraftConfirmFailed])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => (
        <BackButton
          onPress={noProviderError || isFormBlank ? navigation.goBack : goToCancel}
          canGoBack={props.canGoBack}
          label={BackButtonLabelConstants.cancel}
          showCarat={false}
        />
      ),
      headerRight: () =>
        !noRecipientsReceived && (
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
    if (attachmentFileToAdd === undefined) {
      return
    }
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

  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID} />
  }

  if (!hasLoadedRecipients || !isTransitionComplete || savingDraft || loadingSignature) {
    const text = savingDraft ? t('secureMessaging.formMessage.saveDraft.loading') : t('secureMessaging.formMessage.composeMessage.loading')
    return <LoadingComponent text={text} />
  }

  const isFormBlank = !(to || subject || subjectLine || attachmentsList.length || validateMessage(message))
  const isFormValid = !!(to && subject && validateMessage(message) && (subject !== CategoryTypeFields.other || subjectLine))

  const isSetToGeneral = (text: string): boolean => {
    return text === CategoryTypeFields.other // Value of option associated with picker label 'General'
  }

  const onSubjectChange = (newSubject: string): void => {
    setSubject(newSubject)

    // if the subject used to be general and now its not, clear field errors because the subject line is now
    // no longer a required field
    if (isSetToGeneral(subject) && !isSetToGeneral(newSubject)) {
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

  const onAddFiles = navigateTo('Attachments', { origin: FormHeaderTypeConstants.compose, attachmentsList })

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        labelKey: 'health:secureMessaging.formMessage.to',
        selectedValue: to,
        onSelectionChange: setTo,
        // TODO: get real picker options for "To" section via api call
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
        selectedValue: subject,
        onSelectionChange: onSubjectChange,
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
        value: subjectLine,
        onChange: setSubjectLine,
        helperTextKey: 'health:secureMessaging.composeMessage.subjectLine.helperText',
        maxLength: 50,
        isRequiredField: subject === CategoryTypeFields.other,
      },
      fieldErrorMessage: t('secureMessaging.composeMessage.subjectLine.fieldError'),
    },
    {
      fieldType: FieldType.FormAttachmentsList,
      fieldProps: {
        originHeader: t('secureMessaging.composeMessage.compose'),
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
        value: message,
        onChange: setMessage,
        labelKey: 'health:secureMessaging.formMessage.message',
        isRequiredField: true,
        isTextArea: true,
        setInputCursorToBeginning: true,
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
    const messageData = {
      recipient_id: parseInt(to, 10),
      category: subject as CategoryTypes,
      body: message,
      subject: subjectLine,
    } as SecureMessagingFormData

    if (savedDraftID) {
      messageData.draft_id = savedDraftID
    }
    if (onSaveDraftClicked) {
      dispatch(saveDraft(messageData, savedDraftID))
    } else {
      navigation.navigate('SendConfirmation', {
        originHeader: t('secureMessaging.composeMessage.compose'),
        messageData,
        uploads: attachmentsList,
      })
    }
  }

  const renderContent = (): ReactNode => {
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
          <FormWrapper
            fieldsList={formFieldsList}
            onSave={onMessageSendOrSave}
            onSaveClicked={onSendClicked}
            setOnSaveClicked={setOnSendClicked}
            setFormContainsError={setFormContainsError}
            resetErrors={resetErrors}
            setResetErrors={setResetErrors}
          />
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

  return (
    <VAScrollView {...testIdProps('Compose-message-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom}>{renderContent()}</Box>
    </VAScrollView>
  )
}

export default ComposeMessage
