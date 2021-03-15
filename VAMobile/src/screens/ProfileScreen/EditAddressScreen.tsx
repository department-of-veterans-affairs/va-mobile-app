import { HeaderTitle, useHeaderHeight } from '@react-navigation/stack'
import { KeyboardAvoidingView, TextInput } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useRef, useState } from 'react'

import RNPickerSelect from 'react-native-picker-select'

import { AddressData, ScreenIDTypesConstants, addressTypeFields, addressTypes } from 'store/api/types'
import {
  AlertBox,
  Box,
  ErrorComponent,
  FieldType,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  PickerItem,
  VAScrollView,
  VATextInputTypes,
  ValidationFunctionItems,
} from 'components'
import { Countries } from 'constants/countries'
import { HeaderTitleType } from 'styles/common'
import { MilitaryPostOffices } from 'constants/militaryPostOffices'
import { MilitaryStates } from 'constants/militaryStates'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { RootNavStackParamList } from 'App'
import { States } from 'constants/states'
import { finishEditAddress, validateAddress } from 'store/actions'
import { focusPickerRef, focusTextInputRef } from 'utils/common'
import { isIOS } from 'utils/platform'
import { profileAddressOptions } from './AddressSummary'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'
import AddressValidation from './AddressValidation'

const MAX_ADDRESS_LENGTH = 35
const ZIP_CODE_LENGTH = 5

const USA_VALUE = 'USA'

export const AddressDataEditedFieldValues: {
  countryCodeIso3: AddressDataEditedFields
  addressLine1: AddressDataEditedFields
  addressLine2: AddressDataEditedFields
  addressLine3: AddressDataEditedFields
  city: AddressDataEditedFields
  stateCode: AddressDataEditedFields
  zipCode: AddressDataEditedFields
  addressType: AddressDataEditedFields
  province: AddressDataEditedFields
  internationalPostalCode: AddressDataEditedFields
} = {
  countryCodeIso3: 'countryCodeIso3',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  addressLine3: 'addressLine3',
  city: 'city',
  stateCode: 'stateCode',
  zipCode: 'zipCode',
  addressType: 'addressType',
  province: 'province',
  internationalPostalCode: 'internationalPostalCode',
}
export type AddressDataEditedFields =
  | 'countryCodeIso3'
  | 'addressLine1'
  | 'addressLine2'
  | 'addressLine3'
  | 'city'
  | 'stateCode'
  | 'zipCode'
  | 'addressType'
  | 'province'
  | 'internationalPostalCode'

type IEditAddressScreen = StackScreenProps<RootNavStackParamList, 'EditAddress'>

const EditAddressScreen: FC<IEditAddressScreen> = ({ navigation, route }) => {
  const { profile, addressSaved, loading, showValidation } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const dispatch = useDispatch()
  const headerHeight = useHeaderHeight()
  const { displayTitle, addressType } = route.params

  const addressLine1Ref = useRef<TextInput>(null)
  const addressLine3Ref = useRef<TextInput>(null)
  const statePickerRef = useRef<RNPickerSelect>(null)
  const militaryPostOfficeRef = useRef<RNPickerSelect>(null)
  const zipCodeRef = useRef<TextInput>(null)
  const cityRef = useRef<TextInput>(null)

  const getInitialState = (itemToGet: AddressDataEditedFields): string => {
    const item = profile?.[addressType]?.[itemToGet]
    return item ? item : ''
  }

  const getInitialStateForPicker = (itemToGet: AddressDataEditedFields, listToSearch: Array<PickerItem>): string => {
    const item = getInitialState(itemToGet)
    const found = listToSearch.find((obj) => obj.value === item)
    return found ? found.value : ''
  }

  const getInitialStateForCheckBox = (itemToGet: AddressDataEditedFields): boolean => {
    const item = getInitialState(itemToGet)
    return item ? item === addressTypeFields.overseasMilitary : false
  }

  const [checkboxSelected, setCheckboxSelected] = useState(getInitialStateForCheckBox(AddressDataEditedFieldValues.addressType))
  const [country, setCountry] = useState(getInitialStateForPicker(AddressDataEditedFieldValues.countryCodeIso3, Countries))
  const [addressLine1, setAddressLine1] = useState(getInitialState(AddressDataEditedFieldValues.addressLine1))
  const [addressLine2, setAddressLine2] = useState(getInitialState(AddressDataEditedFieldValues.addressLine2))
  const [addressLine3, setAddressLine3] = useState(getInitialState(AddressDataEditedFieldValues.addressLine3))
  const [militaryPostOffice, setMilitaryPostOffice] = useState(getInitialStateForPicker(AddressDataEditedFieldValues.city, MilitaryPostOffices))
  const [city, setCity] = useState(getInitialState(AddressDataEditedFieldValues.city))
  const [state, setState] = useState(
    profile?.[addressType]?.countryCodeIso3 === USA_VALUE
      ? getInitialStateForPicker(AddressDataEditedFieldValues.stateCode, States)
      : getInitialState(AddressDataEditedFieldValues.stateCode) || getInitialState(AddressDataEditedFieldValues.province),
  )
  const [zipCode, setZipCode] = useState(getInitialState(AddressDataEditedFieldValues.zipCode) || getInitialState(AddressDataEditedFieldValues.internationalPostalCode))
  const [formContainsError, setFormContainsError] = useState(false)

  const isDomestic = (countryVal: string): boolean => {
    return countryVal === USA_VALUE || !countryVal
  }

  const getAddressLocationType = (): addressTypes => {
    if (checkboxSelected) {
      return addressTypeFields.overseasMilitary
    } else {
      if (isDomestic(country)) {
        return addressTypeFields.domestic
      } else {
        return addressTypeFields.international
      }
    }
  }

  const onSave = (): void => {
    const addressLocationType = getAddressLocationType()

    const addressId = profile?.[addressType]?.id || 0
    const countryNameObj = Countries.find((countryDef) => countryDef.value === country)
    const countryName = countryNameObj ? countryNameObj.label : ''

    const isInternationalAddress = addressLocationType === addressTypeFields.international

    const addressPost: AddressData = {
      id: addressId,
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2?.trim(),
      addressLine3: addressLine3?.trim(),
      addressPou: addressType === profileAddressOptions.RESIDENTIAL_ADDRESS ? 'RESIDENCE/CHOICE' : 'CORRESPONDENCE',
      addressType: addressLocationType,
      city: city.trim(),
      countryName,
      countryCodeIso3: country,
      stateCode: state,
      zipCode: !isInternationalAddress ? zipCode?.trim() : '',
      internationalPostalCode: isInternationalAddress ? zipCode?.trim() : '',
    }

    if (addressLocationType === addressTypeFields.overseasMilitary) {
      addressPost.city = militaryPostOffice
    }

    // international addresses are to use 'province' instead of 'stateCode'(Backend error if included)
    if (isInternationalAddress) {
      delete addressPost.stateCode
      addressPost.province = state
    }

    dispatch(validateAddress(addressPost, ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID))
  }

  useEffect(() => {
    // if the address is a military base address
    if (checkboxSelected && country !== USA_VALUE) {
      setCountry(USA_VALUE)
      setZipCode('')
    }
  }, [checkboxSelected, country])

  useEffect(() => {
    if (addressSaved) {
      dispatch(finishEditAddress())
      navigation.goBack()
    }
  }, [addressSaved, navigation, dispatch])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (header: HeaderTitleType) => (
        <Box {...testIdProps(displayTitle)} accessibilityRole="header" accessible={true}>
          <HeaderTitle {...header}>{displayTitle}</HeaderTitle>
        </Box>
      ),
    })
  })

  if (useError(ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID)) {
    return <ErrorComponent />
  }

  if (loading || addressSaved) {
    return <LoadingComponent text={t('personalInformation.savingAddress')} />
  }

  if (showValidation) {
    const addressValidationProps = {
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2?.trim(),
      addressLine3: addressLine3?.trim(),
      city: city?.trim(),
      state,
      zipCode: zipCode.trim(),
      addressId: profile?.[addressType]?.id || 0,
    }
    return <AddressValidation {...addressValidationProps} />
  }

  const onCountryChange = (updatedValue: string): void => {
    // if the country used to be domestic and now its not, or vice versa, state and zip code should be reset
    if (isDomestic(country) !== isDomestic(updatedValue)) {
      setState('')
      setZipCode('')
    }

    setCountry(updatedValue)
  }

  const onCheckboxChange = (updatedValue: boolean): void => {
    setCheckboxSelected(updatedValue)

    setState('')
    setCity('')
    setMilitaryPostOffice('')
  }

  const getCityOrMilitaryBaseFormFieldType = (): FormFieldType => {
    if (checkboxSelected) {
      return {
        fieldType: FieldType.Picker,
        fieldProps: {
          selectedValue: militaryPostOffice,
          onSelectionChange: setMilitaryPostOffice,
          pickerOptions: MilitaryPostOffices,
          labelKey: 'profile:editAddress.militaryPostOffices',
          placeholderKey: 'profile:editAddress.militaryPostOfficesPlaceholder',
          onUpArrow: (): void => focusTextInputRef(addressLine3Ref),
          onDownArrow: (): void => focusPickerRef(statePickerRef),
          pickerRef: militaryPostOfficeRef,
          isRequiredField: true,
        },
        fieldErrorMessage: t('editAddress.militaryPostOfficesFieldError'),
      }
    }

    return {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'profile:editAddress.city',
        value: city,
        onChange: setCity,
        placeholderKey: 'profile:editAddress.cityPlaceholder',
        inputRef: cityRef,
        isRequiredField: true,
      },
      fieldErrorMessage: t('editAddress.cityFieldError'),
    }
  }

  const onStatePickerUpArrow = (): void => {
    focusPickerRef(militaryPostOfficeRef)
    focusTextInputRef(cityRef)
  }

  const getStatesFormFieldType = (): FormFieldType => {
    if (isDomestic(country)) {
      const statePickerOptions = checkboxSelected ? MilitaryStates : States

      return {
        fieldType: FieldType.Picker,
        fieldProps: {
          selectedValue: state,
          onSelectionChange: setState,
          pickerOptions: statePickerOptions,
          labelKey: 'profile:editAddress.state',
          placeholderKey: 'profile:editAddress.statePlaceholder',
          onUpArrow: onStatePickerUpArrow,
          onDownArrow: (): void => focusTextInputRef(zipCodeRef),
          pickerRef: statePickerRef,
          isRequiredField: true,
        },
        fieldErrorMessage: t('editAddress.stateFieldError'),
      }
    }

    return {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'profile:editAddress.state',
        value: state,
        onChange: setState,
        placeholderKey: 'profile:editAddress.state',
      },
    }
  }

  const zipCodeLengthValidation = (): boolean => {
    // returns true if the zip code is greater than 0 characters and less than 5 - this means the corresponding error message
    // should be displayed
    return zipCode.length < ZIP_CODE_LENGTH && zipCode.length > 0
  }

  const getZipCodeOrInternationalCodeFields = (): {
    zipCodeLabelKey: string
    zipCodePlaceHolderKey: string
    zipCodeInputType: VATextInputTypes
    zipCodeFieldError: string
    zipCodeValidationList?: Array<ValidationFunctionItems>
  } => {
    if (isDomestic(country)) {
      return {
        zipCodeLabelKey: 'profile:editAddress.zipCode',
        zipCodePlaceHolderKey: 'profile:editAddress.zipCodePlaceholder',
        zipCodeInputType: 'phone',
        zipCodeFieldError: t('editAddress.zipCodeFieldError'),
        zipCodeValidationList: [
          {
            validationFunction: zipCodeLengthValidation,
            validationFunctionErrorMessage: t('editAddress.zipCodeLengthValidationFieldError'),
          },
        ],
      }
    }

    return {
      zipCodeLabelKey: 'profile:editAddress.internationalPostCode',
      zipCodePlaceHolderKey: 'profile:editAddress.internationalPostCodePlaceholder',
      zipCodeInputType: 'none',
      zipCodeFieldError: t('editAddress.internationalPostCodeFieldError'),
    }
  }

  const { zipCodeLabelKey, zipCodePlaceHolderKey, zipCodeInputType, zipCodeFieldError, zipCodeValidationList } = getZipCodeOrInternationalCodeFields()

  const formFieldsList: Array<FormFieldType> = [
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        labelKey: 'profile:editAddress.liveOnMilitaryBase',
        selected: checkboxSelected,
        onSelectionChange: onCheckboxChange,
        a11yHint: t('editAddress.liveOnMilitaryBaseA11yHint'),
      },
    },
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        selectedValue: country,
        onSelectionChange: onCountryChange,
        pickerOptions: Countries,
        labelKey: 'profile:editAddress.country',
        placeholderKey: 'profile:editAddress.countryPlaceholder',
        onDownArrow: (): void => focusTextInputRef(addressLine1Ref),
        isRequiredField: true,
        disabled: checkboxSelected,
      },
      fieldErrorMessage: t('editAddress.countryFieldError'),
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'profile:editAddress.streetAddressLine1',
        value: addressLine1,
        onChange: setAddressLine1,
        placeholderKey: 'profile:editAddress.streetAddressPlaceholder',
        maxLength: MAX_ADDRESS_LENGTH,
        inputRef: addressLine1Ref,
        isRequiredField: true,
        helperTextKey: 'profile:editAddress.streetAddress.helperText',
      },
      fieldErrorMessage: t('editAddress.streetAddressLine1FieldError'),
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'profile:editAddress.streetAddressLine2',
        value: addressLine2,
        onChange: setAddressLine2,
        maxLength: MAX_ADDRESS_LENGTH,
        helperTextKey: 'profile:editAddress.streetAddress.helperText',
      },
    },
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'profile:editAddress.streetAddressLine3',
        value: addressLine3,
        onChange: setAddressLine3,
        maxLength: MAX_ADDRESS_LENGTH,
        inputRef: addressLine3Ref,
        helperTextKey: 'profile:editAddress.streetAddress.helperText',
      },
    },
    getCityOrMilitaryBaseFormFieldType(),
    getStatesFormFieldType(),
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: zipCodeInputType,
        labelKey: zipCodeLabelKey,
        value: zipCode,
        onChange: setZipCode,
        placeholderKey: zipCodePlaceHolderKey,
        inputRef: zipCodeRef,
        isRequiredField: true,
      },
      fieldErrorMessage: zipCodeFieldError,
      validationList: zipCodeValidationList,
    },
  ]

  const testIdPrefix = addressType === profileAddressOptions.MAILING_ADDRESS ? 'Mailing-address: ' : 'Residential-address: '

  return (
    <VAScrollView {...testIdProps(`${testIdPrefix}Edit-address-page`)}>
      <KeyboardAvoidingView behavior={isIOS() ? 'position' : undefined} keyboardVerticalOffset={headerHeight}>
        <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          {formContainsError && (
            <Box mb={theme.dimensions.standardMarginBetween}>
              <AlertBox title={t('editAddress.alertError')} border="error" background="noCardBackground" />
            </Box>
          )}
          <FormWrapper fieldsList={formFieldsList} onSave={onSave} setFormContainsError={setFormContainsError} />
        </Box>
      </KeyboardAvoidingView>
    </VAScrollView>
  )
}

export default EditAddressScreen
