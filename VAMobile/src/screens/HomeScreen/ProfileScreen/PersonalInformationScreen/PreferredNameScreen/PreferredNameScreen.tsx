import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { useDemographics } from 'api/demographics/getDemographics'
import { useUpdatePreferredName } from 'api/demographics/updatePreferredName'
import { Box, FieldType, FormFieldType, FormWrapper, FullScreenSubtask, LoadingComponent } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { stringToTitleCase } from 'utils/formattingUtils'
import { useDestructiveActionSheet, useTheme } from 'utils/hooks'

type PreferredNameScreenProps = StackScreenProps<HomeStackParamList, 'PreferredName'>

const MAX_NAME_LENGTH = 25

function PreferredNameScreen({ navigation }: PreferredNameScreenProps) {
  const snackbar = useSnackbar()
  const { data: demographics } = useDemographics()
  const preferredNameMutation = useUpdatePreferredName()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const confirmAlert = useDestructiveActionSheet()

  const getInitialState = (): string => {
    const item = demographics?.preferredName
    return item ? stringToTitleCase(item) : ''
  }

  const [preferredName, setName] = useState(getInitialState())
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)

  const onConfirmCancel = (): void => {
    if (preferredName !== getInitialState()) {
      confirmAlert({
        title: '',
        message: t('personalInformation.preferredName.cancelMessage'),
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        buttons: [
          {
            text: t('keepEditing'),
            onPress: () => {},
          },
          {
            text: t('deleteChanges'),
            onPress: () => {
              navigation.goBack()
            },
          },
        ],
      })
      return
    } else {
      navigation.goBack()
    }
  }

  const updatePreferredName = () => {
    const mutateOptions = {
      onSuccess: () => {
        snackbar.show(t('personalInformation.preferredName.saved'))
        navigation.goBack()
      },
      onError: () =>
        snackbar.show(t('personalInformation.preferredName.notSaved'), {
          isError: true,
          offset: theme.dimensions.snackBarBottomOffset,
          onActionPressed: updatePreferredName,
        }),
    }
    preferredNameMutation.mutate(preferredName, mutateOptions)
  }

  const onSave = (): void => {
    if (preferredName !== '') {
      updatePreferredName()
    }
  }

  const onSetName = (name: string): void => {
    if (preferredName !== name) {
      setResetErrors(true)
    }
    setName(name)
  }

  const nameLengthValidation = (): boolean => {
    return preferredName.length > MAX_NAME_LENGTH
  }

  const lettersOnlyValidation = (): boolean => {
    return /[^a-zA-Z]/.test(preferredName)
  }

  const whiteSpaceOnlyValidation = (): boolean => {
    return !/[\S]/.test(preferredName)
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'personalInformation.preferredNameScreen.body',
        value: preferredName,
        onChange: onSetName,
        helperTextKey: 'personalInformation.preferredName.editHelperText',
        a11yLabel: 'personalInformation.preferredNameScreen.body.a11yLabel',
        testID: 'preferredNameTestID',
      },
      fieldErrorMessage: t('personalInformation.preferredName.fieldEmpty'),
      validationList: [
        {
          validationFunction: lettersOnlyValidation,
          validationFunctionErrorMessage: t('personalInformation.preferredName.lettersOnly'),
        },
        {
          validationFunction: whiteSpaceOnlyValidation,
          validationFunctionErrorMessage: t('personalInformation.preferredName.fieldEmpty'),
        },
        {
          validationFunction: nameLengthValidation,
          validationFunctionErrorMessage: t('personalInformation.preferredName.tooManyCharacters'),
        },
      ],
    },
  ]

  return (
    <FullScreenSubtask
      leftButtonText={t('cancel')}
      onLeftButtonPress={onConfirmCancel}
      title={t('personalInformation.preferredName.title')}
      primaryContentButtonText={preferredNameMutation.isPending ? undefined : t('save')}
      onPrimaryContentButtonPress={() => setOnSaveClicked(true)}
      leftButtonTestID="preferredNameBackID">
      {preferredNameMutation.isPending ? (
        <LoadingComponent text={t('personalInformation.preferredName.saveLoadingText')} />
      ) : (
        <Box mx={theme.dimensions.gutter}>
          <FormWrapper
            fieldsList={formFieldsList}
            onSave={onSave}
            resetErrors={resetErrors}
            setResetErrors={setResetErrors}
            onSaveClicked={onSaveClicked}
            setOnSaveClicked={setOnSaveClicked}
          />
        </Box>
      )}
    </FullScreenSubtask>
  )
}

export default PreferredNameScreen
