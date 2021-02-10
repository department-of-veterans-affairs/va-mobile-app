import { KeyboardAvoidingView, ScrollView, TextInput } from 'react-native'
import { StackHeaderLeftButtonProps, useHeaderHeight } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'

import RNPickerSelect from 'react-native-picker-select'

import { AddressData, addressTypeFields, addressTypes } from 'store/api/types'
import {
  BackButton,
  Box,
  ErrorComponent,
  LoadingComponent,
  PickerItem,
  SaveButton,
  TextArea,
  TextView,
  VAPicker,
  VAPickerProps,
  VASelector,
  VATextInput,
  VATextInputProps,
  VATextInputTypes,
} from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { Countries } from 'constants/countries'
import { MilitaryPostOffices } from 'constants/militaryPostOffices'
import { MilitaryStates } from 'constants/militaryStates'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { RootNavStackParamList } from 'App'
import { States } from 'constants/states'
import { finishEditAddress, updateAddress } from 'store/actions'
import { focusPickerRef, focusTextInputRef } from 'utils/common'
import { isIOS } from 'utils/platform'
import { profileAddressOptions } from './AddressSummary'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'

const getTextInputProps = (
  inputType: VATextInputTypes,
  labelKey: string,
  value: string,
  onChange: (text: string) => void,
  testID: string,
  placeholderKey?: string,
  maxLength?: number | undefined,
  inputRef?: React.Ref<TextInput>,
): VATextInputProps => {
  return {
    inputType,
    labelKey,
    value,
    onChange,
    testID,
    maxLength,
    placeholderKey,
    inputRef,
  }
}

const getPickerProps = (
  selectedValue: string,
  onSelectionChange: (text: string) => void,
  pickerOptions: Array<PickerItem>,
  labelKey: string,
  placeholderKey: string,
  testID: string,
  onUpArrow?: () => void,
  onDownArrow?: () => void,
  pickerRef?: React.Ref<RNPickerSelect>,
): VAPickerProps => {
  return {
    selectedValue,
    onSelectionChange,
    pickerOptions,
    labelKey,
    placeholderKey,
    testID,
    onDownArrow,
    onUpArrow,
    pickerRef,
  }
}

export const EDIT_ADDRESS_SCREEN_ID = 'EDIT_ADDRESS_SCREEN'

const MAX_ADDRESS_LENGTH = 35

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
  const { profile, addressSaved, loading } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
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
      addressLine1,
      addressLine2,
      addressLine3,
      addressPou: addressType === profileAddressOptions.RESIDENTIAL_ADDRESS ? 'RESIDENCE/CHOICE' : 'CORRESPONDENCE',
      addressType: addressLocationType,
      city,
      countryName,
      countryCodeIso3: country,
      stateCode: state,
      zipCode: !isInternationalAddress ? zipCode : '',
      internationalPostalCode: isInternationalAddress ? zipCode : '',
    }

    if (addressLocationType === addressTypeFields.overseasMilitary) {
      addressPost.city = militaryPostOffice
    }

    // international addresses are to use 'province' instead of 'stateCode'(Backend error if included)
    if (isInternationalAddress) {
      delete addressPost.stateCode
      addressPost.province = state
    }

    dispatch(updateAddress(addressPost, EDIT_ADDRESS_SCREEN_ID))
  }

  const areAllFieldsFilled = (itemsToCheck: Array<string>): boolean => {
    return itemsToCheck.filter(Boolean).length === itemsToCheck.length
  }

  const areAllFieldsEmpty = (itemsToCheck: Array<string>): boolean => {
    return itemsToCheck.filter(Boolean).length === 0
  }

  const isAddressValid = (): boolean => {
    const addressLocationType = getAddressLocationType()

    const allFields = [country, addressLine1, addressLine2, addressLine3, state, zipCode, city, militaryPostOffice]

    // for residential addresses, also accept a blank form as valid
    if (addressType === profileAddressOptions.RESIDENTIAL_ADDRESS && areAllFieldsEmpty(allFields)) {
      return true
    }

    switch (addressLocationType) {
      case addressTypeFields.overseasMilitary:
        return areAllFieldsFilled([addressLine1, militaryPostOffice, state, zipCode])
      case addressTypeFields.domestic:
        return areAllFieldsFilled([country, addressLine1, city, state, zipCode])
      case addressTypeFields.international:
        return areAllFieldsFilled([country, addressLine1, city, zipCode])
      default:
        return false
    }
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
      headerTitle: displayTitle,
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
      headerRight: () => <SaveButton onSave={onSave} disabled={!isAddressValid()} />,
    })
  })

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

  const checkboxProps = {
    label: t('editAddress.liveOnMilitaryBase'),
    selected: checkboxSelected,
    onSelectionChange: onCheckboxChange,
    a11yHint: t('editAddress.liveOnMilitaryBaseA11yHint'),
  }

  const countryPickerProps = getPickerProps(
    country,
    onCountryChange,
    Countries,
    'profile:editAddress.country',
    'profile:editAddress.countryPlaceholder',
    'country-picker',
    undefined,
    (): void => focusTextInputRef(addressLine1Ref),
  )

  const onStatePickerUpArrow = (): void => {
    focusPickerRef(militaryPostOfficeRef)
    focusTextInputRef(cityRef)
  }

  const statePickerOptions = checkboxSelected ? MilitaryStates : States
  const statePickerProps = getPickerProps(
    state,
    setState,
    statePickerOptions,
    'profile:editAddress.state',
    'profile:editAddress.statePlaceholder',
    'state-picker',
    onStatePickerUpArrow,
    (): void => focusTextInputRef(zipCodeRef),
    statePickerRef,
  )

  const militaryPostOfficePickerProps = getPickerProps(
    militaryPostOffice,
    setMilitaryPostOffice,
    MilitaryPostOffices,
    'profile:editAddress.militaryPostOffices',
    'profile:editAddress.militaryPostOfficesPlaceholder',
    'military-post-office-picker',
    (): void => focusTextInputRef(addressLine3Ref),
    (): void => focusPickerRef(statePickerRef),
    militaryPostOfficeRef,
  )

  const addressLine1Props = getTextInputProps(
    'none',
    'profile:editAddress.streetAddressLine1',
    addressLine1,
    setAddressLine1,
    'address-line-1-text-input',
    'profile:editAddress.streetAddressPlaceholder',
    MAX_ADDRESS_LENGTH,
    addressLine1Ref,
  )
  const addressLine2Props = getTextInputProps(
    'none',
    'profile:editAddress.streetAddressLine2',
    addressLine2,
    setAddressLine2,
    'address-line-2-text-input',
    undefined,
    MAX_ADDRESS_LENGTH,
  )
  const addressLine3Props = getTextInputProps(
    'none',
    'profile:editAddress.streetAddressLine3',
    addressLine3,
    setAddressLine3,
    'address-line-3-text-input',
    undefined,
    MAX_ADDRESS_LENGTH,
    addressLine3Ref,
  )
  const cityProps = getTextInputProps('none', 'profile:editAddress.city', city, setCity, 'city-text-input', 'profile:editAddress.cityPlaceholder', undefined, cityRef)
  const internationalStateProps = getTextInputProps('none', 'profile:editAddress.state', state, setState, 'state-text-input', 'profile:editAddress.state')

  const getZipCodeFields = (): { label: string; placeHolder: string; inputType: VATextInputTypes } => {
    if (isDomestic(country)) {
      return {
        label: 'profile:editAddress.zipCode',
        placeHolder: 'profile:editAddress.zipCodePlaceholder',
        inputType: 'phone',
      }
    }

    return {
      label: 'profile:editAddress.internationalPostCode',
      placeHolder: 'profile:editAddress.internationalPostCodePlaceholder',
      inputType: 'none',
    }
  }

  const { label, placeHolder, inputType } = getZipCodeFields()
  const zipCodeProps = getTextInputProps(inputType, label, zipCode, setZipCode, 'zipCode-text-input', placeHolder, undefined, zipCodeRef)

  const getCityOrMilitaryBaseComponent = (): ReactNode => {
    return checkboxSelected ? <VAPicker {...militaryPostOfficePickerProps} /> : <VATextInput {...cityProps} />
  }

  const getStates = (): ReactNode => {
    return isDomestic(country) ? <VAPicker {...statePickerProps} /> : <VATextInput {...internationalStateProps} />
  }

  if (useError(EDIT_ADDRESS_SCREEN_ID)) {
    return <ErrorComponent />
  }

  if (loading || addressSaved) {
    return <LoadingComponent text={t('personalInformation.savingAddress')} />
  }

  const testIdPrefix = addressType === profileAddressOptions.MAILING_ADDRESS ? 'Mailing-address: ' : 'Residential-address: '

  return (
    <ScrollView {...testIdProps(`${testIdPrefix}Edit-address-page`)}>
      <KeyboardAvoidingView behavior={isIOS() ? 'position' : undefined} keyboardVerticalOffset={headerHeight}>
        <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
          <TextArea>
            <VASelector {...checkboxProps} />
          </TextArea>
          <Box mt={theme.dimensions.marginBetween}>
            <VAPicker {...countryPickerProps} disabled={checkboxSelected} />
          </Box>
          <TextView variant="TableHeaderBold" ml={theme.dimensions.gutter} mt={theme.dimensions.marginBetween}>
            {t('editAddress.streetAddress')}
          </TextView>
          <Box mt={theme.dimensions.titleHeaderAndElementMargin}>
            <VATextInput {...addressLine1Props} />
            <VATextInput {...addressLine2Props} />
            <VATextInput {...addressLine3Props} />
          </Box>
          <Box mt={theme.dimensions.marginBetween}>{getCityOrMilitaryBaseComponent()}</Box>
          <Box mt={theme.dimensions.marginBetweenCards}>{getStates()}</Box>
          <Box mt={theme.dimensions.marginBetweenCards}>
            <VATextInput {...zipCodeProps} />
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

export default EditAddressScreen
