import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useRef, useState } from 'react'

import { AlertBox, Box, ButtonTypesConstants, ErrorComponent, FieldType, FormFieldType, FormWrapper, FullScreenSubtask, LoadingComponent, VAButton } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { MAX_DIGITS, MAX_DIGITS_AFTER_FORMAT } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, deleteUsersNumber, editUsersNumber, finishEditPhoneNumber } from 'store/slices/personalInformationSlice'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SnackbarMessages } from 'components/SnackBar'
import { dispatchClearErrors } from 'store/slices/errorSlice'
import { formatPhoneNumber, getNumbersFromString } from 'utils/formattingUtils'
import { getFormattedPhoneNumber } from 'utils/common'
import { useAppDispatch, useDestructiveAlert, useError, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

type IEditPhoneNumberScreen = StackScreenProps<HomeStackParamList, 'EditPhoneNumber'>

const EditPhoneNumberScreen: FC<IEditPhoneNumberScreen> = ({ navigation, route }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { displayTitle, phoneType, phoneData } = route.params
  const deletePhoneAlert = useDestructiveAlert()

  const [extension, setExtension] = useState(phoneData?.extension || '')
  const [phoneNumber, setPhoneNumber] = useState(getFormattedPhoneNumber(phoneData))
  const [formContainsError, setFormContainsError] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  const { phoneNumberSaved, loading } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)

  useEffect(() => {
    if (phoneNumberSaved) {
      dispatch(finishEditPhoneNumber())
      setDeleting(false)
      navigation.goBack()
    }
  }, [phoneNumberSaved, navigation, dispatch])

  const saveSnackbarMessages: SnackbarMessages = {
    successMsg: t('contactInformation.phoneNumber.saved', { type: displayTitle }),
    errorMsg: t('contactInformation.phoneNumber.not.saved', { type: displayTitle }),
  }

  const onSave = (): void => {
    const onlyDigitsNum = getNumbersFromString(phoneNumber)
    const numberId = phoneData && phoneData.id ? phoneData.id : 0

    dispatch(editUsersNumber(phoneType, onlyDigitsNum, extension, numberId, saveSnackbarMessages, ScreenIDTypesConstants.EDIT_PHONE_NUMBER_SCREEN_ID))
  }

  const removeSnackbarMessages: SnackbarMessages = {
    successMsg: t('contactInformation.phoneNumber.removed', { type: displayTitle }),
    errorMsg: t('contactInformation.phoneNumber.not.removed', { type: displayTitle }),
  }

  const onDelete = (): void => {
    setDeleting(true)
    dispatch(deleteUsersNumber(phoneType, removeSnackbarMessages, ScreenIDTypesConstants.EDIT_PHONE_NUMBER_SCREEN_ID))
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

  const goBack = () => {
    navigation.goBack()
    // clear errors so it doesnt persist on other phone edit screens
    dispatch(dispatchClearErrors(ScreenIDTypesConstants.EDIT_PHONE_NUMBER_SCREEN_ID))
  }

  if (useError(ScreenIDTypesConstants.EDIT_PHONE_NUMBER_SCREEN_ID)) {
    return (
      <FullScreenSubtask title={displayTitle} leftButtonText={t('cancel')} onLeftButtonPress={goBack}>
        <ErrorComponent screenID={ScreenIDTypesConstants.EDIT_PHONE_NUMBER_SCREEN_ID} />
      </FullScreenSubtask>
    )
  }

  if (loading || phoneNumberSaved) {
    const loadingText = deleting ? t('contactInformation.delete.phone') : t('contactInformation.savingPhoneNumber')

    return (
      <FullScreenSubtask leftButtonText={t('cancel')} onLeftButtonPress={goBack}>
        <LoadingComponent text={loadingText} />
      </FullScreenSubtask>
    )
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'phone',
        labelKey: 'common:editPhoneNumber.number',
        onChange: setPhoneNumberOnChange,
        maxLength: MAX_DIGITS_AFTER_FORMAT,
        value: phoneNumber,
        onEndEditing: onEndEditingPhoneNumber,
        isRequiredField: true,
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
        labelKey: 'common:editPhoneNumber.extension',
        onChange: setExtension,
        value: extension,
      },
    },
  ]

  const buttonTitle = displayTitle.toLowerCase()

  const onDeletePressed = (): void => {
    deletePhoneAlert({
      title: t('editPhoneNumber.remove.title', { numberType: buttonTitle }),
      message: t('editPhoneNumber.remove.message', { numberType: buttonTitle }),
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('cancel'),
        },
        {
          text: t('remove'),
          onPress: onDelete,
        },
      ],
    })
  }

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={displayTitle}
      leftButtonText={t('cancel')}
      onLeftButtonPress={goBack}
      rightButtonText={t('save')}
      onRightButtonPress={() => setOnSaveClicked(true)}>
      <Box mt={theme?.dimensions?.contentMarginTop} mb={theme?.dimensions?.contentMarginBottom}>
        {getFormattedPhoneNumber(phoneData) !== '' && (
          <Box mb={theme?.dimensions?.standardMarginBetween} mx={theme?.dimensions?.gutter}>
            <VAButton
              onPress={onDeletePressed}
              label={t('contactInformation.removeData', { pageName: buttonTitle })}
              buttonType={ButtonTypesConstants.buttonDestructive}
              a11yHint={t('contactInformation.removeData.a11yHint', { pageName: buttonTitle })}
            />
          </Box>
        )}
        <AlertBox text={t('editPhoneNumber.weCanOnlySupportUSNumbers')} border="informational" />
        {formContainsError && (
          <Box mt={theme?.dimensions?.standardMarginBetween}>
            <AlertBox scrollViewRef={scrollViewRef} title={t('editPhoneNumber.checkPhoneNumber')} border="error" focusOnError={onSaveClicked} />
          </Box>
        )}
        <Box mt={theme?.dimensions?.formMarginBetween} mx={theme?.dimensions?.gutter}>
          <FormWrapper fieldsList={formFieldsList} onSave={onSave} setFormContainsError={setFormContainsError} onSaveClicked={onSaveClicked} setOnSaveClicked={setOnSaveClicked} />
        </Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default EditPhoneNumberScreen
