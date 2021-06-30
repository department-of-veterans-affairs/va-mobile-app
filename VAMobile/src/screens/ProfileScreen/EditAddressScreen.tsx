import { HeaderTitle, StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TextInput } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'

import { AddressData, ScreenIDTypesConstants, addressTypeFields, addressTypes } from 'store/api/types'
import {
  AlertBox,
  BackButton,
  Box,
  ErrorComponent,
  FieldType,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  PickerItem,
  SaveButton,
  VAScrollView,
  VATextInputTypes,
  ValidationFunctionItems,
} from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { Countries } from 'constants/countries'
import { HeaderTitleType } from 'styles/common'
import { MilitaryPostOffices } from 'constants/militaryPostOffices'
import { MilitaryStates } from 'constants/militaryStates'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { RootNavStackParamList } from 'App'
import { States } from 'constants/states'
import { deleteAddress, finishEditAddress, validateAddress } from 'store/actions'
import { profileAddressOptions } from './AddressSummary'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'
import AddressValidation from './AddressValidation'
import RemoveData from './RemoveData'

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
  const { displayTitle, addressType } = route.params

  const [deleting, setDeleting] = useState(false)

  const addressLine1Ref = useRef<TextInput>(null)
  const addressLine3Ref = useRef<TextInput>(null)
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
  const [resetErrors, setResetErrors] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)

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

  const onDelete = (): void => {
    const currentAddressData = profile?.[addressType]

    if (!currentAddressData) {
      // Cannot delete without existing data
      return
    }

    setDeleting(true)
    dispatch(deleteAddress(currentAddressData, ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID))
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
    }
  }, [checkboxSelected, country])

  useEffect(() => {
    if (addressSaved) {
      dispatch(finishEditAddress())
      setDeleting(false)
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
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
      headerRight: () => <SaveButton onSave={() => setOnSaveClicked(true)} disabled={false} />,
    })
  })

  if (useError(ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.EDIT_ADDRESS_SCREEN_ID} />
  }

  if (loading || addressSaved) {
    const loadingText = deleting ? t('personalInformation.delete.address') : t('personalInformation.savingAddress')

    return <LoadingComponent text={loadingText} />
  }

  if (showValidation) {
    const addressValidationProps = {
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2?.trim(),
      addressLine3: addressLine3?.trim(),
      city: checkboxSelected ? militaryPostOffice?.trim() : city?.trim(),
      state,
      zipCode: zipCode.trim(),
      addressId: profile?.[addressType]?.id || 0,
      country: country
    }
    return <AddressValidation {...addressValidationProps} />
  }

  const clearFieldsAndErrors = (): void => {
    setAddressLine1('')
    setAddressLine2('')
    setAddressLine3('')
    setCity('')
    setState('')
    setZipCode('')
    setMilitaryPostOffice('')

    // clear all current field errors since inputs change
    setResetErrors(true)
  }

  const onCountryChange = (updatedValue: string): void => {
    // if the country used to be domestic and now its not, or vice versa, all fields should be reset
    // and all current field errors should be cleared
    if (isDomestic(country) !== isDomestic(updatedValue)) {
      clearFieldsAndErrors()
    }

    setCountry(updatedValue)
  }

  const onCheckboxChange = (updatedValue: boolean): void => {
    setCheckboxSelected(updatedValue)
    clearFieldsAndErrors()

    if (!updatedValue) {
      setCountry('')
    }
  }

  const getCityOrMilitaryBaseFormFieldType = (): FormFieldType<unknown> => {
    if (checkboxSelected) {
      return {
        fieldType: FieldType.Picker,
        fieldProps: {
          selectedValue: militaryPostOffice,
          onSelectionChange: setMilitaryPostOffice,
          pickerOptions: MilitaryPostOffices,
          includeBlankPlaceholder: true,
          labelKey: 'profile:editAddress.militaryPostOffices',
          isRequiredField: true,
        },
        fieldErrorMessage: t('editAddress.validOptionFieldError'),
      }
    }

    return {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'profile:editAddress.city',
        value: city,
        onChange: setCity,
        inputRef: cityRef,
        isRequiredField: true,
      },
      fieldErrorMessage: t('editAddress.cityFieldError'),
    }
  }

  const getStatesFormFieldType = (): FormFieldType<unknown> => {
    if (isDomestic(country)) {
      const pickerOptions = checkboxSelected ? MilitaryStates : States

      return {
        fieldType: FieldType.Picker,
        fieldProps: {
          selectedValue: state,
          onSelectionChange: setState,
          pickerOptions: pickerOptions,
          labelKey: 'profile:editAddress.state',
          includeBlankPlaceholder: true,
          isRequiredField: true,
        },
        fieldErrorMessage: checkboxSelected ? t('editAddress.validOptionFieldError') : t('editAddress.stateFieldError'),
      }
    }

    return {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'none',
        labelKey: 'profile:editAddress.state',
        value: state,
        onChange: setState,
      },
    }
  }

  const zipCodeLengthValidation = (): boolean => {
    // returns true if the zip code is greater than 0 characters and the length is not equal to 5 - this means the
    // corresponding error message should be displayed
    return zipCode.length !== ZIP_CODE_LENGTH && zipCode.length > 0
  }

  const getZipCodeOrInternationalCodeFields = (): {
    zipCodeLabelKey: string
    zipCodeInputType: VATextInputTypes
    zipCodeFieldError: string
    zipCodeValidationList?: Array<ValidationFunctionItems>
  } => {
    if (isDomestic(country)) {
      return {
        zipCodeLabelKey: 'profile:editAddress.zipCode',
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
      zipCodeInputType: 'none',
      zipCodeFieldError: t('editAddress.internationalPostCodeFieldError'),
    }
  }

  const { zipCodeLabelKey, zipCodeInputType, zipCodeFieldError, zipCodeValidationList } = getZipCodeOrInternationalCodeFields()

  const formFieldsList: Array<FormFieldType<unknown>> = [
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
        includeBlankPlaceholder: true,
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
        inputRef: zipCodeRef,
        isRequiredField: true,
      },
      fieldErrorMessage: zipCodeFieldError,
      validationList: zipCodeValidationList,
    },
  ]

  const testIdPrefix = addressType === profileAddressOptions.MAILING_ADDRESS ? 'Mailing-address: ' : 'Residential-address: '
  const noAddressData = !profile?.[addressType]

  return (
    <VAScrollView {...testIdProps(`${testIdPrefix}Edit-address-page`)}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {addressType === profileAddressOptions.RESIDENTIAL_ADDRESS && !noAddressData && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <RemoveData pageName={displayTitle.toLowerCase()} alertText={displayTitle.toLowerCase()} confirmFn={onDelete} />
          </Box>
        )}
        {formContainsError && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox title={t('editAddress.alertError')} border="error" background="noCardBackground" />
          </Box>
        )}
        <FormWrapper
          fieldsList={formFieldsList}
          onSave={onSave}
          setFormContainsError={setFormContainsError}
          resetErrors={resetErrors}
          setResetErrors={setResetErrors}
          onSaveClicked={onSaveClicked}
          setOnSaveClicked={setOnSaveClicked}
        />
      </Box>
    </VAScrollView>
  )
}

export default EditAddressScreen
