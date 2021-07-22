import React, { FC, ReactNode, useEffect, useState } from 'react'

import {
  BackButton,
  Box,
  ButtonTypesConstants,
  CollapsibleView,
  CrisisLineCta,
  FieldType,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  MessageAlert,
  SaveButton,
  TextArea,
  TextView,
  VAButton,
  VAScrollView,
} from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { FormHeaderTypeConstants } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingState, StoreState, resetSendMessageFailed } from 'store'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { formatSubject } from 'utils/secureMessaging'
import { renderMessages } from '../ViewMessage/ViewMessageScreen'
import { saveDraft } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useDispatch, useSelector } from 'react-redux'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import _ from 'underscore'

type ReplyMessageProps = StackScreenProps<HealthStackParamList, 'ReplyMessage'>

const ReplyMessage: FC<ReplyMessageProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const dispatch = useDispatch()

  const [onSendClicked, setOnSendClicked] = useState(false)
  const [onSaveDraftClicked, setOnSaveDraftClicked] = useState(false)
  const [messageReply, setMessageReply] = useState('')
  const [formContainsError, setFormContainsError] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)
  const [attachmentsList, setAttachmentsList] = useState<Array<ImagePickerResponse | DocumentPickerResponse>>([])
  const { messageID, attachmentFileToAdd, attachmentFileToRemove } = route.params
  const { savedDraftID, messagesById, threads, loading, saveDraftComplete, saveDraftFailed, savingDraft, sendMessageFailed } = useSelector<StoreState, SecureMessagingState>(
    (state) => state.secureMessaging,
  )

  const message = messagesById?.[messageID]
  const thread = threads?.find((threadIdArray) => threadIdArray.includes(messageID))
  const subject = message ? message.subject : ''
  const category = message ? message.category : 'OTHER'
  // Receiver is the sender of the message user is replying to
  const receiverName = message ? message.senderName : ''
  const receiverID = message?.senderId
  const subjectHeader = formatSubject(category, subject, t)

  const goToCancel = navigateTo('ReplyCancelConfirmation', { messageID })

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={goToCancel} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
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

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  if (loading) {
    return <LoadingComponent text={t('secureMessaging.viewMessage.loading')} />
  }

  const onAddFiles = navigateTo('Attachments', { origin: FormHeaderTypeConstants.reply, attachmentsList, messageID })

  const removeAttachment = (attachmentFile: ImagePickerResponse | DocumentPickerResponse): void => {
    navigateTo('RemoveAttachment', { origin: FormHeaderTypeConstants.reply, attachmentFileToRemove: attachmentFile })()
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.FormAttachmentsList,
      fieldProps: {
        originHeader: t('secureMessaging.reply'),
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
        value: messageReply,
        onChange: setMessageReply,
        labelKey: 'health:secureMessaging.formMessage.message',
        isRequiredField: true,
        isTextArea: true,
      },
      fieldErrorMessage: t('secureMessaging.formMessage.message.fieldError'),
    },
  ]

  const sendReplyOrSaveDraft = (): void => {
    dispatch(resetSendMessageFailed())
    const messageData = { body: messageReply }

    if (onSaveDraftClicked) {
      dispatch(saveDraft(messageData, savedDraftID, true, messageID))
    } else {
      receiverID &&
        navigateTo('SendConfirmation', {
          originHeader: t('secureMessaging.reply'),
          messageData,
          uploads: attachmentsList,
          messageID,
        })()
    }
  }

  const renderForm = (): ReactNode => {
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
          <TextView accessible={true}>{t('secureMessaging.formMessage.to')}</TextView>
          <TextView variant="MobileBodyBold" accessible={true}>
            {receiverName}
          </TextView>
          <TextView mt={theme.dimensions.standardMarginBetween} accessible={true}>
            {t('secureMessaging.formMessage.subject')}
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
            {renderMessages(message, messagesById, thread)}
          </Box>
        )}
      </Box>
    )
  }

  return (
    <VAScrollView {...testIdProps('Reply-message-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box>{renderForm()}</Box>
        <Box>{renderMessageThread()}</Box>
      </Box>
    </VAScrollView>
  )
}

export default ReplyMessage
