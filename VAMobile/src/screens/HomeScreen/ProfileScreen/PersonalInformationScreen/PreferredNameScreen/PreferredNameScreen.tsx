import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { AlertBox, Box, FieldType, FormFieldType, FormWrapper, FullScreenSubtask, LoadingComponent } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { Waygate, waygateEnabled } from 'utils/remoteConfig'
import { stringToTitleCase } from 'utils/formattingUtils'
import { useDemographics } from 'api/demographics/getDemographics'
import { useDestructiveActionSheet, useTheme } from 'utils/hooks'
import { useUpdatePreferredName } from 'api/demographics/updatePreferredName'

type PreferredNameScreenProps = StackScreenProps<HomeStackParamList, 'PreferredName'>

const MAX_NAME_LENGTH = 25

const PreferredNameScreen: FC<PreferredNameScreenProps> = ({ navigation }) => {
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

  useEffect(() => {
    if (preferredNameMutation.isSuccess) {
      navigation.goBack()
    }
  }, [preferredNameMutation.isSuccess, navigation])

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

  const onSave = (): void => {
    if (preferredName !== '') {
      preferredNameMutation.mutate(preferredName)
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

  if (preferredNameMutation.isLoading) {
    return (
      <FullScreenSubtask leftButtonText={t('cancel')} onLeftButtonPress={navigation.goBack}>
        <LoadingComponent text={t('personalInformation.preferredName.saveLoadingText')} />
      </FullScreenSubtask>
    )
  }

  const waygateCheck = (wg: Waygate): ReactNode => {
    if (wg.enabled) {
      return screenContent()
    } else if (wg.enabled === false && wg.allowFunction === true) {
      return (
        <Box>
          <Box mb={theme.dimensions.condensedMarginBetween}>
            <AlertBox border="warning" title={wg.errorMsgTitle} text={wg.errorMsgBody} />
          </Box>
          {screenContent()}
        </Box>
      )
    } else {
      return <AlertBox border="error" title={wg.errorMsgTitle} text={wg.errorMsgBody} />
    }
  }

  const screenContent = (): ReactNode => {
    return (
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
    )
  }

  const wg = waygateEnabled('WG_PreferredNameScreen')

  return (
    <FullScreenSubtask
      leftButtonText={t('cancel')}
      onLeftButtonPress={onConfirmCancel}
      title={t('personalInformation.preferredName.title')}
      primaryContentButtonText={wg.enabled || wg.allowFunction ? t('save') : undefined}
      onPrimaryContentButtonPress={() => setOnSaveClicked(true)}>
      {waygateCheck(wg)}
    </FullScreenSubtask>
  )
}

export default PreferredNameScreen
