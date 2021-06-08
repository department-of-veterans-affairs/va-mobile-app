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
  ClickToCallPhoneNumber,
  CollapsibleView,
  CrisisLineCta,
  ErrorComponent,
  FieldType,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  PickerItem,
  TextArea,
  TextView,
  VAButton,
  VAScrollView,
} from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { CategoryTypeFields, CategoryTypes, ScreenIDTypesConstants, SecureMessagingTabTypesConstants } from 'store/api/types'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingState, StoreState } from 'store/reducers'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { formHeaders } from 'constants/secureMessaging'
import { getComposeMessageSubjectPickerOptions } from 'utils/secureMessaging'
import { getMessageRecipients, resetSendMessageFailed, updateSecureMessagingTab } from 'store/actions'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type ComposeMessageProps = StackScreenProps<HealthStackParamList, 'ComposeMessage'>

const ComposeMessage: FC<ComposeMessageProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const th = useTranslation(NAMESPACE.HOME)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const dispatch = useDispatch()

  const { recipients, hasLoadedRecipients, sendMessageFailed } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)
  const { attachmentFileToAdd, attachmentFileToRemove } = route.params

  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [subjectLine, setSubjectLine] = useState('')
  const [attachmentsList, setAttachmentsList] = useState<Array<ImagePickerResponse | DocumentPickerResponse>>([])
  const [message, setMessage] = useState('')
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [formContainsError, setFormContainsError] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)

  useEffect(() => {
    dispatch(getMessageRecipients(ScreenIDTypesConstants.SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN_ID))
  }, [dispatch])

  const goToCancel = navigateTo('ComposeCancelConfirmation')

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={goToCancel} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
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

  if (!hasLoadedRecipients) {
    return <LoadingComponent />
  }

  const removeAttachment = (attachmentFile: ImagePickerResponse | DocumentPickerResponse): void => {
    navigateTo('RemoveAttachment', { origin: formHeaders.compose, attachmentFileToRemove: attachmentFile })()
  }

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

  const onAddFiles = navigateTo('Attachments', { origin: formHeaders.compose, attachmentsList })

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
      },
      fieldErrorMessage: t('secureMessaging.formMessage.message.fieldError'),
    },
  ]

  const onGoToInbox = (): void => {
    dispatch(resetSendMessageFailed())
    dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))
    navigateTo('SecureMessaging')()
  }

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const onMessageSend = (): void => {
    dispatch(resetSendMessageFailed())
    navigateTo('SendConfirmation', {
      originHeader: t('secureMessaging.composeMessage.compose'),
      messageData: { recipient_id: parseInt(to, 10), category: subject as CategoryTypes, body: message, subject: subjectLine },
      uploads: attachmentsList,
    })()
  }

  const renderContent = (): ReactNode => {
    const noRecipientsReceived = !recipients || recipients.length === 0

    if (noRecipientsReceived && hasLoadedRecipients) {
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
        {sendMessageFailed && (
          <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
            <AlertBox
              border={'error'}
              background={'noCardBackground'}
              title={t('secureMessaging.sendError.title')}
              text={t('secureMessaging.sendError.ifTheAppStill')}
              textA11yLabel={t('secureMessaging.sendError.ifTheAppStill.a11y')}>
              {<ClickToCallPhoneNumber phone={t('secureMessaging.attachments.FAQ.ifYourProblem.phone')} {...a11yHintProp(th('veteransCrisisLine.callA11yHint'))} />}
            </AlertBox>
          </Box>
        )}
        {formContainsError && (
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
            <AlertBox title={t('secureMessaging.formMessage.checkYourMessage')} border="error" background="noCardBackground" />
          </Box>
        )}
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
            onSave={onMessageSend}
            onSaveClicked={onSaveClicked}
            setOnSaveClicked={setOnSaveClicked}
            setFormContainsError={setFormContainsError}
            resetErrors={resetErrors}
            setResetErrors={setResetErrors}
          />
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VAButton
              label={t('secureMessaging.formMessage.send')}
              onPress={() => setOnSaveClicked(true)}
              a11yHint={t('secureMessaging.formMessage.send.a11yHint')}
              buttonType={ButtonTypesConstants.buttonPrimary}
            />
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VAButton
              label={t('common:cancel')}
              onPress={() => goToCancel()}
              a11yHint={t('secureMessaging.formMessage.cancel.a11yHint')}
              buttonType={ButtonTypesConstants.buttonSecondary}
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
