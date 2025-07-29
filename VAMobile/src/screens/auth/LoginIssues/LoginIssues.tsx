import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigation } from '@react-navigation/native'

import { Button, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, FieldType, FormFieldType, FormWrapper, FullScreenSubtask } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type LoginIssuesProps = Record<string, unknown>

function LoginIssues({}: LoginIssuesProps) {
  const theme = useTheme()
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigation = useNavigation()

  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [loginIssue, setLoginIssue] = useState('')
  const [loginIssueOtherText, setLoginIssueOtherText] = useState('')
  const [loginProvider, setLoginProvider] = useState('')
  const [loginPreviously, setLoginPreviously] = useState('')
  const [loginFrequency, setLoginFrequency] = useState('')
  const [loginAdditionalFeedback, setLoginAdditionalFeedback] = useState('')

  const onSave = () => {
    // logAnalyticsEvent...
    snackbar.show(t('loginIssues.feedbackSubmitted'))
    navigation.goBack()
  }

  const formFieldsList: Array<FormFieldType<string>> = [
    {
      fieldType: FieldType.Radios,
      fieldProps: {
        labelKey: 'loginIssues.whatIssue',
        value: loginIssue,
        onChange: (evt: string) => {
          // Clears other text when a new option is selected
          if (evt !== t('other.describe')) {
            setLoginIssueOtherText('')
          }
          setLoginIssue(evt)
        },
        boldLabelKey: true,
        radioOptionSpacing: theme.dimensions.condensedMarginBetween,
        options: [
          {
            optionLabelKey: t('loginIssues.existingAccount'),
            value: t('loginIssues.existingAccount'),
          },
          {
            optionLabelKey: t('loginIssues.newAccount'),
            value: t('loginIssues.newAccount'),
          },
          {
            optionLabelKey: t('loginIssues.identity'),
            value: t('loginIssues.identity'),
          },
          {
            optionLabelKey: t('other.describe'),
            value: t('other.describe'),
            textInput: loginIssueOtherText,
            setTextInput: setLoginIssueOtherText,
          },
        ],
      },
    },
    {
      fieldType: FieldType.Radios,
      fieldProps: {
        labelKey: 'loginIssues.loginProvider',
        value: loginProvider,
        onChange: setLoginProvider,
        boldLabelKey: true,
        radioOptionSpacing: theme.dimensions.condensedMarginBetween,
        options: [
          {
            optionLabelKey: t('login.gov'),
            value: t('login.gov'),
          },
          {
            optionLabelKey: t('id.me'),
            value: t('id.me'),
          },
          {
            optionLabelKey: t('ds.logon'),
            value: t('ds.logon'),
          },
        ],
      },
    },
    {
      fieldType: FieldType.Radios,
      fieldProps: {
        labelKey: 'loginIssues.loginPreviously',
        value: loginPreviously,
        onChange: setLoginPreviously,
        boldLabelKey: true,
        radioOptionSpacing: theme.dimensions.condensedMarginBetween,
        options: [
          {
            optionLabelKey: t('yes'),
            value: t('yes'),
          },
          {
            optionLabelKey: t('no'),
            value: t('no'),
          },
        ],
      },
    },
    {
      fieldType: FieldType.Radios,
      fieldProps: {
        labelKey: 'loginIssues.frequency',
        value: loginFrequency,
        onChange: setLoginFrequency,
        boldLabelKey: true,
        radioOptionSpacing: theme.dimensions.condensedMarginBetween,
        options: [
          {
            optionLabelKey: t('always'),
            value: t('always'),
          },
          {
            optionLabelKey: t('often'),
            value: t('often'),
          },
          {
            optionLabelKey: t('sometimes'),
            value: t('sometimes'),
          },
          {
            optionLabelKey: t('rarely'),
            value: t('rarely'),
          },
          {
            optionLabelKey: t('never'),
            value: t('never'),
          },
        ],
      },
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        value: loginAdditionalFeedback,
        onChange: setLoginAdditionalFeedback,
        labelKey: 'loginIssues.additionalFeedback',
        isTextArea: true,
        setInputCursorToBeginning: true,
        boldLabelKey: true,
      },
    },
  ]

  return (
    <FullScreenSubtask
      title={t('loginIssues.reportIssue')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <FormWrapper
          fieldsList={formFieldsList}
          onSave={onSave}
          onSaveClicked={onSaveClicked}
          setOnSaveClicked={setOnSaveClicked}
        />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <Button
            label={t('submit')}
            onPress={() => {
              setOnSaveClicked(true)
            }}
          />
        </Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default LoginIssues
