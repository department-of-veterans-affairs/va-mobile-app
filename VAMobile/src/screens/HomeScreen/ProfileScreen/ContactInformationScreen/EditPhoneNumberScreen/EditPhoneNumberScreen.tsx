import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useRef, useState } from 'react'

import { AlertBox, Box, ButtonTypesConstants, FieldType, FormFieldType, FormWrapper, FullScreenSubtask, LoadingComponent, VAButton } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { MAX_DIGITS, MAX_DIGITS_AFTER_FORMAT } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { PhoneData, PhoneType, PhoneTypeToFormattedNumber, UserContactInformation } from 'api/types'
import { SnackbarMessages } from 'components/SnackBar'
import { formatPhoneNumber, getNumbersFromString } from 'utils/formattingUtils'
import { getFormattedPhoneNumber, isErrorObject, showSnackBar } from 'utils/common'
import { useAlert, useAppDispatch, useBeforeNavBackListener, useDestructiveActionSheet, useIsScreenReaderEnabled, useTheme } from 'utils/hooks'
import { useContactInformation } from 'api/contactInformation/getContactInformation'
import { useDeletePhoneNumber, useSavePhoneNumber } from 'api/contactInformation'

type IEditPhoneNumberScreen = StackScreenProps<HomeStackParamList, 'EditPhoneNumber'>

const EditPhoneNumberScreen: FC<IEditPhoneNumberScreen> = ({ navigation, route }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { displayTitle, phoneType, phoneData } = route.params
  const deletePhoneAlert = useAlert()
  const confirmAlert = useDestructiveActionSheet()
  const screenReaderEnabled = useIsScreenReaderEnabled()
  const [extension, setExtension] = useState(phoneData?.extension || '')
  const [phoneNumber, setPhoneNumber] = useState(getFormattedPhoneNumber(phoneData))
  const [formContainsError, setFormContainsError] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  const { data: contactInformation } = useContactInformation()
  const { mutate: deletePhoneNumber, isLoading: deletingPhoneNumber, isSuccess: phoneNumberDeleted } = useDeletePhoneNumber()
  const { mutate: savePhoneNumber, isLoading: savingPhoneNumber, isSuccess: phoneNumberSaved } = useSavePhoneNumber()

  useEffect(() => {
    if (phoneNumberDeleted || phoneNumberSaved) {
      navigation.goBack()
    }
  }, [phoneNumberDeleted, phoneNumberSaved, navigation])

  const saveSnackbarMessages: SnackbarMessages = {
    successMsg: t('contactInformation.phoneNumber.saved', { type: displayTitle }),
    errorMsg: t('contactInformation.phoneNumber.not.saved', { type: displayTitle }),
  }

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

    const phoneNumberExists = (contactInformation || {})[PhoneTypeToFormattedNumber[phoneType as PhoneType] as keyof UserContactInformation]

    if (phoneNumberExists && phoneData.id) {
      phoneDataPayload = {
        ...phoneDataPayload,
        id: phoneData.id,
      }
    }

    const save = (): void => {
      const mutateOptions = {
        onSuccess: () => showSnackBar(saveSnackbarMessages.successMsg, dispatch, undefined, true, false, true),
        onError: (error: unknown) => isErrorObject(error) && showSnackBar(saveSnackbarMessages.errorMsg, dispatch, save, false, true, true),
      }
      savePhoneNumber(phoneDataPayload, mutateOptions)
    }

    save()
  }

  const removeSnackbarMessages: SnackbarMessages = {
    successMsg: t('contactInformation.phoneNumber.removed', { type: displayTitle }),
    errorMsg: t('contactInformation.phoneNumber.not.removed', { type: displayTitle }),
  }

  const onDelete = (): void => {
    if (phoneData) {
      const mutateOptions = {
        onSuccess: () => showSnackBar(removeSnackbarMessages.successMsg, dispatch, undefined, true, false, true),
        onError: (error: unknown) =>
          isErrorObject(error) && showSnackBar(removeSnackbarMessages.errorMsg, dispatch, () => deletePhoneNumber(phoneData, mutateOptions), false, true, true),
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

  if (deletingPhoneNumber || savingPhoneNumber) {
    const loadingText = deletingPhoneNumber ? t('contactInformation.delete.phone') : t('contactInformation.savingPhoneNumber')

    return (
      <FullScreenSubtask leftButtonText={t('cancel')} onLeftButtonPress={navigation.goBack}>
        <LoadingComponent text={loadingText} />
      </FullScreenSubtask>
    )
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
      screenReaderEnabled: screenReaderEnabled,
    })
  }

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={displayTitle}
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}
      rightButtonText={t('save')}
      onRightButtonPress={() => setOnSaveClicked(true)}>
      <Box mb={theme.dimensions.contentMarginBottom}>
        {getFormattedPhoneNumber(phoneData) !== '' && (
          <Box my={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
            <VAButton onPress={onDeletePressed} label={t('contactInformation.removeData', { pageName: buttonTitle })} buttonType={ButtonTypesConstants.buttonDestructive} />
          </Box>
        )}
        <AlertBox text={t('editPhoneNumber.weCanOnlySupportUSNumbers')} border="informational" />
        {formContainsError && (
          <Box mt={theme.dimensions.standardMarginBetween}>
            <AlertBox scrollViewRef={scrollViewRef} title={t('editPhoneNumber.checkPhoneNumber')} border="error" focusOnError={onSaveClicked} />
          </Box>
        )}
        <Box mt={theme.dimensions.formMarginBetween} mx={theme.dimensions.gutter}>
          <FormWrapper fieldsList={formFieldsList} onSave={onSave} setFormContainsError={setFormContainsError} onSaveClicked={onSaveClicked} setOnSaveClicked={setOnSaveClicked} />
        </Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default EditPhoneNumberScreen
