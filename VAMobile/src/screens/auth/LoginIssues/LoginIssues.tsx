import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { Button, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, FieldType, FormFieldType, FormWrapper, FullScreenSubtask } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { checkStringForPII } from 'utils/common'
import { getBuildNumber, getDeviceName, getVersionName } from 'utils/deviceData'
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

  const logFeedback = async (newOtherText: string, newFeedbackText: string) => {
    const buildNumber = await getBuildNumber()
    const version = await getVersionName()
    const device = await getDeviceName()

    const answers = {
      q1: loginIssue,
      q2: newOtherText,
      q3: loginProvider,
      q4: loginPreviously,
      q5: loginFrequency,
      q6: newFeedbackText,
      q7: buildNumber,
      q8: version,
      q9: device,
    }

    await logAnalyticsEvent(Events.vama_login_issue(answers))
  }

  const onSave = async () => {
    const { found: otherTextFound, newText: newOtherText } = checkStringForPII(loginIssueOtherText)
    const { found: additionalFeedbackFound, newText: newFeedbackText } = checkStringForPII(loginAdditionalFeedback)
    if (otherTextFound || additionalFeedbackFound) {
      Alert.alert(t('inAppFeedback.personalInfo.title'), t('inAppFeedback.personalInfo.body'), [
        {
          text: t('loginIssues.edit'),
          style: 'cancel',
        },
        {
          text: t('loginIssues.submitAnyway'),
          onPress: async () => {
            await logFeedback(newOtherText, newFeedbackText)
            navigation.goBack()
            snackbar.show(t('loginIssues.feedbackSubmitted'))
          },
          style: 'default',
        },
      ])
    } else {
      await logFeedback(newOtherText, newFeedbackText)
      navigation.goBack()
      snackbar.show(t('loginIssues.feedbackSubmitted'))
    }
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
            optionLabelKey: 'loginIssues.existingAccount',
            value: t('loginIssues.existingAccount'),
          },
          {
            optionLabelKey: 'loginIssues.newAccount',
            value: t('loginIssues.newAccount'),
          },
          {
            optionLabelKey: 'loginIssues.identity',
            value: t('loginIssues.identity'),
          },
          {
            optionLabelKey: 'other.describe',
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
            optionLabelKey: 'login.gov',
            value: t('login.gov'),
          },
          {
            optionLabelKey: 'id.me',
            value: t('id.me'),
          },
          {
            optionLabelKey: 'ds.logon',
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
            optionLabelKey: 'yes',
            value: t('yes'),
          },
          {
            optionLabelKey: 'no',
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
            optionLabelKey: 'always',
            value: 'always',
          },
          {
            optionLabelKey: 'often',
            value: t('often'),
          },
          {
            optionLabelKey: 'sometimes',
            value: t('sometimes'),
          },
          {
            optionLabelKey: 'rarely',
            value: t('rarely'),
          },
          {
            optionLabelKey: 'never',
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
