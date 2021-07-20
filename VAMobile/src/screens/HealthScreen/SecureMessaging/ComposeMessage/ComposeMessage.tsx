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
import { CategoryTypeFields, CategoryTypes, ScreenIDTypesConstants, SecureMessagingTabTypesConstants } from 'store/api/types'
import { ComposeTypeConstants } from 'constants/secureMessaging'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { formatSubject } from 'utils/secureMessaging'
import { getComposeMessageSubjectPickerOptions } from 'utils/secureMessaging'
import { getMessage, getMessageRecipients, getThread, resetSendMessageFailed, saveDraft, updateSecureMessagingTab } from 'store/actions'
import { renderMessages } from '../ViewMessage/ViewMessageScreen'
import { testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type ComposeMessageProps = StackScreenProps<HealthStackParamList, 'ComposeMessage'>

const ComposeMessage: FC<ComposeMessageProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const dispatch = useDispatch()

  const { draftMessageID, hasLoadedRecipients, loading, messagesById, recipients, saveDraftComplete, saveDraftFailed, savingDraft, sendMessageFailed, threads } = useSelector<
    StoreState,
    SecureMessagingState
  >((state) => state.secureMessaging)

  const { attachmentFileToAdd, attachmentFileToRemove, composeType = ComposeTypeConstants.new } = route.params

  const messageID = Number(route.params?.messageID)
  const message = messageID ? messagesById?.[messageID] : null
  const isReply = composeType === ComposeTypeConstants.reply

  const [to, setTo] = useState(message?.recipientId?.toString() || '')
  const [category, setCategory] = useState(message?.category || '')
  const [subject, setSubject] = useState(message?.subject || '')
  const [attachmentsList, setAttachmentsList] = useState<Array<ImagePickerResponse | DocumentPickerResponse>>([])
  const [body, setBody] = useState(isReply ? '' : message?.body || '')
  const [onSendClicked, setOnSendClicked] = useState(false)
  const [onSaveDraftClicked, setOnSaveDraftClicked] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)
  const [isReplyDraft, setIsReplyDraft] = useState(false)
  const [thread, setThread] = useState(threads?.find((threadIdArray) => threadIdArray.includes(messageID)))

  const isNewMessage = composeType === ComposeTypeConstants.new
  const isDraft = composeType === ComposeTypeConstants.draft
  const isNewDraft = isDraft && !isReplyDraft
  const isReplyOrReplyDraft = composeType === ComposeTypeConstants.reply || isReplyDraft

  const subjectHeader = category ? formatSubject(category as CategoryTypes, subject, t) : ''

  useEffect(() => {
    dispatch(getMessageRecipients(ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID))

    if (messageID) {
      dispatch(getMessage(messageID, ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID))

      // If we're editing a draft, we need to fetch the message history to determine if it's a reply
      if (isDraft) {
        dispatch(getThread(Number(messageID), ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID))
      }
    }
  }, [composeType, isDraft, messageID, dispatch])

  useEffect(() => {
    if (isDraft && !loading) {
      setBody(message?.body || '')
    }

    const replyThread = threads?.find((threadIdArray) => threadIdArray.includes(messageID))

    if (replyThread && replyThread.length > 1) {
      setThread(replyThread)
      setIsReplyDraft(true)
    }
  }, [composeType, isDraft, loading, message, messageID, threads])

  const noRecipientsReceived = !recipients || recipients.length === 0
  const noProviderError = noRecipientsReceived && hasLoadedRecipients

  const goToCancel = isReply ? navigateTo('ReplyCancelConfirmation', { messageID }) : navigateTo('ComposeCancelConfirmation')

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton
          onPress={noProviderError || isFormBlank ? navigation.goBack : goToCancel}
          canGoBack={props.canGoBack}
          label={BackButtonLabelConstants.cancel}
          showCarat={false}
        />
      ),
      headerRight: () =>
        (!noRecipientsReceived || isReply || isReplyDraft) && (
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

  if (!hasLoadedRecipients || loading) {
    return <LoadingComponent />
  }

  const isFormBlank = !(to || category || subject || attachmentsList.length || body)

  const removeAttachment = (attachmentFile: ImagePickerResponse | DocumentPickerResponse): void => {
    navigation.navigate('RemoveAttachment', { composeType, attachmentFileToRemove: attachmentFile })
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

  const onAddFiles = navigateTo('Attachments', { composeType, attachmentsList })

  let formFieldsList: Array<FormFieldType<unknown>> = []

  if (isNewMessage || isNewDraft) {
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
    const messageData = { recipient_id: parseInt(to, 10), category: category as CategoryTypes, body, subject }

    if (onSaveDraftClicked) {
      dispatch(saveDraft(messageData, draftMessageID))
    } else {
      const messageIdToSend = isDraft ? messageID : draftMessageID

      // TODO: send along composeType so API knows which endpoint to POST to
      navigation.navigate('SendConfirmation', {
        originHeader: t('secureMessaging.composeMessage.compose'),
        messageData,
        uploads: attachmentsList,
        messageID: messageIdToSend,
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

    if (savingDraft) {
      return <LoadingComponent text={t('secureMessaging.formMessage.saveDraft.loading')} />
    }

    return (
      <Box>
        <MessageAlert
          hasValidationError={formContainsError}
          saveDraftAttempted={onSaveDraftClicked}
          saveDraftComplete={saveDraftComplete}
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
          {message && isReplyOrReplyDraft && (
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
          <Box mt={isReplyOrReplyDraft ? theme.dimensions.standardMarginBetween : 0}>
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

    // If we're editing a draft, don't display the draft message in the thread
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
        <Box>{(isReply || isReplyDraft) && renderMessageThread()}</Box>
      </Box>
    </VAScrollView>
  )
}

export default ComposeMessage
