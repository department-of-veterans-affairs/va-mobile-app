import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, ButtonVariants, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { useDeletePhoneNumber, useSavePhoneNumber } from 'api/contactInformation'
import { useContactInformation } from 'api/contactInformation/getContactInformation'
import { PhoneData, PhoneType, PhoneTypeToFormattedNumber, UserContactInformation } from 'api/types'
import {
  AlertWithHaptics,
  Box,
  FieldType,
  FormFieldType,
  FormWrapper,
  FullScreenSubtask,
  LoadingComponent,
} from 'components'
import { MAX_DIGITS, MAX_DIGITS_AFTER_FORMAT } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { getFormattedPhoneNumber, isErrorObject } from 'utils/common'
import { formatPhoneNumber, getNumbersFromString } from 'utils/formattingUtils'
import { useAlert, useBeforeNavBackListener, useDestructiveActionSheet, useTheme } from 'utils/hooks'

type IEditPhoneNumberScreen = StackScreenProps<HomeStackParamList, 'EditPhoneNumber'>

function EditPhoneNumberScreen({ navigation, route }: IEditPhoneNumberScreen) {
  const snackbar = useSnackbar()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { displayTitle, phoneType, phoneData } = route.params
  const deletePhoneAlert = useAlert()
  const confirmAlert = useDestructiveActionSheet()
  const [extension, setExtension] = useState(phoneData?.extension || '')
  const [phoneNumber, setPhoneNumber] = useState(getFormattedPhoneNumber(phoneData))
  const [formContainsError, setFormContainsError] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  const { data: contactInformation } = useContactInformation()
  const {
    mutate: deletePhoneNumber,
    isPending: deletingPhoneNumber,
    isSuccess: phoneNumberDeleted,
  } = useDeletePhoneNumber()
  const { mutate: savePhoneNumber, isPending: savingPhoneNumber, isSuccess: phoneNumberSaved } = useSavePhoneNumber()

  useEffect(() => {
    if (phoneNumberDeleted || phoneNumberSaved) {
      navigation.goBack()
    }
  }, [phoneNumberDeleted, phoneNumberSaved, navigation])

  useBeforeNavBackListener(navigation, (e) => {
    if (noPageChanges()) {
      return
    }
    e.preventDefault()
    confirmAlert({
      title: t('contactInformation.phoneNumber.deleteChanges', { type: displayTitle.toLowerCase() }),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('keepEditing'),
        },
        {
          text: t('deleteChanges'),
          onPress: () => {
            navigation.dispatch(e.data.action)
          },
        },
      ],
    })
  })

  //returns true when no edits have been made.
  const noPageChanges = (): boolean => {
    if (phoneData) {
      if (getNumbersFromString(phoneNumber) === getNumbersFromString(getFormattedPhoneNumber(phoneData))) {
        if (phoneData.extension && phoneData.extension === extension) {
          return true
        } else if (!phoneData.extension && !extension) {
          return true
        }
      }
    } else if (!extension && !phoneNumber) {
      return true
    }
    return false
  }

  const onSave = (): void => {
    const onlyDigitsNum = getNumbersFromString(phoneNumber)

    let phoneDataPayload: PhoneData = {
      areaCode: onlyDigitsNum.substring(0, 3),
      countryCode: '1',
      phoneNumber: onlyDigitsNum.substring(3),
      phoneType,
    }

    if (extension) {
      phoneDataPayload = {
        ...phoneDataPayload,
        extension,
      }
    }

    const phoneNumberExists = (contactInformation || {})[
      PhoneTypeToFormattedNumber[phoneType as PhoneType] as keyof UserContactInformation
    ]

    if (phoneNumberExists && phoneData.id) {
      phoneDataPayload = {
        ...phoneDataPayload,
        id: phoneData.id,
      }
    }

    const save = (): void => {
      const mutateOptions = {
        onSuccess: () => {
          snackbar.show(t('contactInformation.phoneNumber.saved', { type: displayTitle }))
        },
        onError: (error: unknown) =>
          isErrorObject(error) &&
          snackbar.show(t('contactInformation.phoneNumber.not.saved', { type: displayTitle }), {
            isError: true,
            offset: theme.dimensions.snackBarBottomOffset,
            onActionPressed: save,
          }),
      }
      savePhoneNumber(phoneDataPayload, mutateOptions)
    }

    save()
  }

  const onDelete = (): void => {
    if (phoneData) {
      const mutateOptions = {
        onSuccess: () => snackbar.show(t('contactInformation.phoneNumber.removed', { type: displayTitle })),
        onError: (error: unknown) =>
          isErrorObject(error) &&
          snackbar.show(t('contactInformation.phoneNumber.not.removed', { type: displayTitle }), {
            isError: true,
            offset: theme.dimensions.snackBarBottomOffset,
            onActionPressed: () => deletePhoneNumber(phoneData, mutateOptions),
          }),
      }
      deletePhoneNumber(phoneData, mutateOptions)
    }
  }

  const setPhoneNumberOnChange = (text: string): void => {
    // Retrieve only digits from text input
    const onlyDigitsNum = getNumbersFromString(text)

    // if there are 10 or less digits, update the text input value of phone number to the incoming text
    if (onlyDigitsNum.length <= MAX_DIGITS) {
      setPhoneNumber(text)
    }
  }

  const onEndEditingPhoneNumber = (): void => {
    // Retrieve only digits from text input
    const onlyDigitsNum = getNumbersFromString(phoneNumber)

    // if there are 10 digits display the formatted phone number
    // otherwise, display just the number
    if (onlyDigitsNum.length === MAX_DIGITS) {
      const formattedPhoneNumber = formatPhoneNumber(onlyDigitsNum)
      setPhoneNumber(formattedPhoneNumber)
    } else {
      setPhoneNumber(onlyDigitsNum)
    }
  }

  const phoneNumberIsNotTenDigits = (): boolean => {
    // returns true if the number is greater than 0 characters and the length is not equal to 10, or there are no numbers
    // - this means the corresponding validation function error message should be displayed
    const onlyDigitsNum = getNumbersFromString(phoneNumber)
    return (onlyDigitsNum.length !== MAX_DIGITS && onlyDigitsNum.length > 0) || !onlyDigitsNum
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'phone',
        labelKey: 'editPhoneNumber.number',
        onChange: setPhoneNumberOnChange,
        maxLength: MAX_DIGITS_AFTER_FORMAT,
        value: phoneNumber,
        onEndEditing: onEndEditingPhoneNumber,
        isRequiredField: true,
        testID: 'phoneNumberTestID',
      },
      fieldErrorMessage: t('editPhoneNumber.numberFieldError'),
      validationList: [
        {
          validationFunction: phoneNumberIsNotTenDigits,
          validationFunctionErrorMessage: t('editPhoneNumber.numberFieldError'),
        },
      ],
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'phone',
        labelKey: 'editPhoneNumber.extension',
        onChange: setExtension,
        value: extension,
        testID: 'phoneNumberExtensionTestID',
      },
    },
  ]

  const buttonTitle = displayTitle.toLowerCase()

  const onDeletePressed = (): void => {
    deletePhoneAlert({
      title: t('contactInformation.removeInformation.title', { info: buttonTitle }),
      message: t('contactInformation.removeInformation.body', { info: buttonTitle }),
      buttons: [
        {
          text: t('keep'),
        },
        {
          text: t('remove'),
          onPress: onDelete,
        },
      ],
    })
  }

  const isLoading = deletingPhoneNumber || savingPhoneNumber
  const loadingText = deletingPhoneNumber
    ? t('contactInformation.delete.phone')
    : t('contactInformation.savingPhoneNumber')

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={isLoading ? '' : displayTitle}
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}
      rightButtonText={isLoading ? '' : t('save')}
      onRightButtonPress={() => setOnSaveClicked(true)}
      leftButtonTestID="contactInfoBackTestID"
      rightButtonTestID="contactInfoSaveTestID">
      {isLoading ? (
        <LoadingComponent text={loadingText} />
      ) : (
        <Box mb={theme.dimensions.contentMarginBottom}>
          {getFormattedPhoneNumber(phoneData) !== '' && (
            <Box my={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
              <Button
                onPress={onDeletePressed}
                label={t('contactInformation.removeData', { pageName: buttonTitle })}
                buttonType={ButtonVariants.Destructive}
              />
            </Box>
          )}
          <AlertWithHaptics variant="info" description={t('editPhoneNumber.weCanOnlySupportUSNumbers')} />
          {formContainsError && (
            <Box mt={theme.dimensions.standardMarginBetween}>
              <AlertWithHaptics
                variant="error"
                description={t('editPhoneNumber.checkPhoneNumber')}
                focusOnError={onSaveClicked}
                scrollViewRef={scrollViewRef}
              />
            </Box>
          )}
          <Box mt={theme.dimensions.formMarginBetween} mx={theme.dimensions.gutter}>
            <FormWrapper
              fieldsList={formFieldsList}
              onSave={onSave}
              setFormContainsError={setFormContainsError}
              onSaveClicked={onSaveClicked}
              setOnSaveClicked={setOnSaveClicked}
            />
          </Box>
        </Box>
      )}
    </FullScreenSubtask>
  )
}

export default EditPhoneNumberScreen
