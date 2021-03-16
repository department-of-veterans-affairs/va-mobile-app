import { HeaderTitle, StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { AlertBox, Box, ErrorComponent, FieldType, FormFieldType, FormWrapper, LoadingComponent, VAScrollView } from 'components'
import { HeaderTitleType } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { PhoneTypeConstants } from 'store/api/types'
import { RootNavStackParamList } from 'App'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { editUsersNumber, finishEditPhoneNumber } from 'store/actions'
import { formatPhoneNumber, getNumbersFromString } from 'utils/formattingUtils'
import { getFormattedPhoneNumber } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'

const MAX_DIGITS = 10
const MAX_DIGITS_AFTER_FORMAT = 14

type IEditPhoneNumberScreen = StackScreenProps<RootNavStackParamList, 'EditPhoneNumber'>

const EditPhoneNumberScreen: FC<IEditPhoneNumberScreen> = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const { displayTitle, phoneType, phoneData } = route.params

  const [extension, setExtension] = useState(phoneData?.extension || '')
  const [phoneNumber, setPhoneNumber] = useState(getFormattedPhoneNumber(phoneData))
  const [formContainsError, setFormContainsError] = useState(false)

  const { phoneNumberSaved, loading } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  useEffect(() => {
    if (phoneNumberSaved) {
      dispatch(finishEditPhoneNumber())
      navigation.goBack()
    }
  }, [phoneNumberSaved, navigation, dispatch])

  const onSave = (): void => {
    const onlyDigitsNum = getNumbersFromString(phoneNumber)
    const numberId = phoneData && phoneData.id ? phoneData.id : 0

    dispatch(editUsersNumber(phoneType, onlyDigitsNum, extension, numberId, ScreenIDTypesConstants.EDIT_PHONE_NUMBER_SCREEN_ID))
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
    // returns true if the number is greater than 0 characters and the length is not equal to 10 - this means the
    // corresponding validation function error message should be displayed
    const onlyDigitsNum = getNumbersFromString(phoneNumber)
    return onlyDigitsNum.length !== MAX_DIGITS && onlyDigitsNum.length > 0
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (header: HeaderTitleType) => (
        <Box {...testIdProps(displayTitle)} accessibilityRole="header" accessible={true}>
          <HeaderTitle {...header}>{displayTitle}</HeaderTitle>
        </Box>
      ),
    })
  })

  if (useError(ScreenIDTypesConstants.EDIT_PHONE_NUMBER_SCREEN_ID)) {
    return <ErrorComponent />
  }

  if (loading || phoneNumberSaved) {
    return <LoadingComponent text={t('personalInformation.savingPhoneNumber')} />
  }

  const formFieldsList: Array<FormFieldType> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'phone',
        labelKey: 'profile:editPhoneNumber.number',
        onChange: setPhoneNumberOnChange,
        placeholderKey: 'profile:editPhoneNumber.number',
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
        labelKey: 'profile:editPhoneNumber.extension',
        onChange: setExtension,
        placeholderKey: 'profile:editPhoneNumber.extension',
        value: extension,
      },
    },
  ]

  const testIdPrefix = phoneType === PhoneTypeConstants.FAX ? 'fax-number: ' : `${phoneType.toLowerCase()}-phone: `

  return (
    <VAScrollView {...testIdProps(`${testIdPrefix}Edit-number-page`)}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <AlertBox text={t('editPhoneNumber.weCanOnlySupportUSNumbers')} background="noCardBackground" border="informational" />
        {formContainsError && (
          <Box mt={theme.dimensions.standardMarginBetween}>
            <AlertBox title={t('editDirectDeposit.pleaseCheckDDInfo')} border="error" background="noCardBackground" />
          </Box>
        )}
        <Box mt={theme.dimensions.formMarginBetween}>
          <FormWrapper fieldsList={formFieldsList} onSave={onSave} setFormContainsError={setFormContainsError} />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default EditPhoneNumberScreen
