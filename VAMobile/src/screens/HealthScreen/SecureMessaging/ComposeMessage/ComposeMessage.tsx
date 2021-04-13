import React, { FC, useState } from 'react'

import { Box, CollapsibleView, CrisisLineCta, FieldType, FormFieldType, FormWrapper, TextArea, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

const ComposeMessage: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [subjectLine, setSubjectLine] = useState('')
  const [onSaveClicked, setOnSaveClicked] = useState(false)

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        labelKey: 'health:secureMessaging.composeMessage.to',
        selectedValue: to,
        onSelectionChange: setTo,
        pickerOptions: [],
        isRequiredField: true,
      },
    },
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        labelKey: 'health:secureMessaging.composeMessage.subject',
        selectedValue: subject,
        onSelectionChange: setSubject,
        pickerOptions: [],
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
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default ComposeMessage
