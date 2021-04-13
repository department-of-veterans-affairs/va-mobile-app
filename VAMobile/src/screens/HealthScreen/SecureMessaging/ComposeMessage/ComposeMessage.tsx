import React, { FC, ReactNode, useEffect, useState } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'

import {
  BackButton,
  Box,
  ButtonTypesConstants,
  CollapsibleView,
  CrisisLineCta,
  FieldType,
  FormFieldType,
  FormWrapper,
  TextArea,
  TextView,
  VAButton,
  VAScrollView,
} from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { getComposeMessageSubjectPickerOptions } from 'utils/secureMessaging'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type ComposeMessageProps = StackScreenProps<HealthStackParamList, 'ComposeMessage'>

const ComposeMessage: FC<ComposeMessageProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [subjectLine, setSubjectLine] = useState('')
  const [attachmentsList, setAttachmentsList] = useState([])
  const [message, setMessage] = useState('')
  const [onSaveClicked, setOnSaveClicked] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const removeAttachment = (attachmentToRemove: ImagePickerResponse | DocumentPickerResponse): void => {
    const updatedAttachmentList = attachmentsList.filter((attachment) => attachment !== attachmentToRemove)
    setAttachmentsList(updatedAttachmentList)
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        labelKey: 'health:secureMessaging.composeMessage.to',
        selectedValue: to,
        onSelectionChange: setTo,
        // TODO: get real picker options for "To" section via api call
        pickerOptions: [
          {
            value: '',
            label: '',
          },
          {
            value: 'Doctor 1',
            label: 'Doctor 1',
          },
          {
            value: 'Doctor 2',
            label: 'Doctor 2',
          },
        ],
        isRequiredField: true,
      },
    },
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        labelKey: 'health:secureMessaging.composeMessage.subject',
        selectedValue: subject,
        onSelectionChange: setSubject,
        pickerOptions: getComposeMessageSubjectPickerOptions(t),
        isRequiredField: true,
      },
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
        isRequiredField: subject === t('secureMessaging.composeMessage.general'),
      },
    },
    {
      fieldType: FieldType.FormAttachmentsList,
      fieldProps: {
        removeOnPress: removeAttachment,
        largeButtonProps: {
          label: t('secureMessaging.composeMessage.addFiles'),
          a11yHint: t('secureMessaging.composeMessage.addFiles.a11yHint'),
          onPress: () => {},
        },
        attachmentsList,
      },
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        value: message,
        onChange: setMessage,
        labelKey: 'health:secureMessaging.composeMessage.message',
        isRequiredField: true,
        isTextArea: true,
      },
    },
  ]

  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const onMessageSend = () => {}

  return (
    <VAScrollView {...testIdProps('Compose-message-page')}>
      <CrisisLineCta onPress={onCrisisLine} />
      <Box mb={theme.dimensions.contentMarginBottom}>
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
          <FormWrapper fieldsList={formFieldsList} onSave={onMessageSend} onSaveClicked={onSaveClicked} setOnSaveClicked={setOnSaveClicked} />
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VAButton
              label={t('secureMessaging.composeMessage.send')}
              onPress={() => setOnSaveClicked(true)}
              a11yHint={t('secureMessaging.composeMessage.send.a11yHint')}
              buttonType={ButtonTypesConstants.buttonPrimary}
            />
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VAButton
              label={t('common:cancel')}
              onPress={() => navigation.goBack()}
              a11yHint={t('secureMessaging.composeMessage.cancel.a11yHint')}
              buttonType={ButtonTypesConstants.buttonSecondary}
            />
          </Box>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default ComposeMessage
