import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { Box, FieldType, FormFieldType, FormWrapper, FullScreenSubtask, LoadingComponent } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, finishUpdatePreferredName, updatePreferredName } from 'store/slices'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api'
import { SnackbarMessages } from 'components/SnackBar'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

type PreferredNameScreenProps = StackScreenProps<HomeStackParamList, 'PreferredName'>

const MAX_NAME_LENGTH = 25

const PreferredNameScreen: FC<PreferredNameScreenProps> = ({ navigation }) => {
  const { profile, preferredNameSaved, loading } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const getInitialState = (): string => {
    const item = profile?.preferredName
    return item ? item : ''
  }

  const [preferredName, setName] = useState(getInitialState())
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [resetErrors, setResetErrors] = useState(false)

  useEffect(() => {
    if (preferredNameSaved) {
      dispatch(finishUpdatePreferredName())
      navigation.goBack()
    }
  }, [preferredNameSaved, navigation, dispatch])

  const snackbarMessages: SnackbarMessages = {
    successMsg: t('personalInformation.preferredName.saved'),
    errorMsg: t('personalInformation.preferredName.notSaved'),
  }

  const onSave = (): void => {
    if (preferredName !== '') {
      dispatch(updatePreferredName(preferredName, snackbarMessages, ScreenIDTypesConstants.PREFERRED_NAME_SCREEN))
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
        isRequiredField: true,
      },
      fieldErrorMessage: t('personalInformation.preferredName.fieldEmpty'),
      validationList: [
        {
          validationFunction: nameLengthValidation,
          validationFunctionErrorMessage: t('personalInformation.preferredName.tooManyCharacters'),
        },
        {
          validationFunction: lettersOnlyValidation,
          validationFunctionErrorMessage: t('personalInformation.preferredName.lettersOnly'),
        },
        {
          validationFunction: whiteSpaceOnlyValidation,
          validationFunctionErrorMessage: t('personalInformation.preferredName.fieldEmpty'),
        },
      ],
    },
  ]

  if (loading || preferredNameSaved) {
    return <LoadingComponent text={t('personalInformation.preferredName.saveLoadingText')} />
  }

  return (
    <FullScreenSubtask
      leftButtonText={t('cancel')}
      onLeftButtonPress={preferredName === getInitialState() ? navigation.goBack : undefined}
      title={t('personalInformation.preferredName.title')}
      primaryContentButtonText={t('save')}
      onPrimaryContentButtonPress={() => setOnSaveClicked(true)}>
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
    </FullScreenSubtask>
  )
}

export default PreferredNameScreen
