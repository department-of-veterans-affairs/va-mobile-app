import { KeyboardAvoidingView, ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { AddressData, addressTypeFields, addressTypes } from 'store/api/types'
import {
  BackButton,
  Box,
  CheckBox,
  PickerItem,
  SaveButton,
  TextArea,
  TextView,
  VAPicker,
  VAPickerProps,
  VATextInput,
  VATextInputProps,
  VATextInputTypes,
  paddingFields,
} from 'components'
import { Countries } from 'constants/countries'
import { MilitaryPostOffices } from 'constants/militaryPostOffices'
import { MilitaryStates } from 'constants/militaryStates'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { ProfileStackParamList } from './ProfileScreen'
import { States } from 'constants/states'
import { finishEditAddress, updateAddress } from 'store/actions'
import { isIOS } from 'utils/platform'
import { profileAddressOptions } from './AddressSummary'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const getTextInputProps = (
  inputType: VATextInputTypes,
  labelKey: string,
  value: string,
  onChange: (text: string) => void,
  testID: string,
  placeholderKey?: string,
  maxLength?: number | undefined,
): VATextInputProps => {
  return {
    inputType,
    labelKey,
    value,
    onChange,
    testID,
    maxLength,
    placeholderKey,
  }
}

const getPickerProps = (
  selectedValue: string,
  onSelectionChange: (text: string) => void,
  pickerOptions: Array<PickerItem>,
  labelKey: string,
  placeholderKey: string,
  testID: string,
): VAPickerProps => {
  return {
    selectedValue,
    onSelectionChange,
    pickerOptions,
    labelKey,
    placeholderKey,
    testID,
  }
}

const MAX_ADDRESS_LENGTH = 35

const USA_VALUE = 'USA'

export const AddressDataEditedFieldValues: {
  countryCode: AddressDataEditedFields
  addressLine1: AddressDataEditedFields
  addressLine2: AddressDataEditedFields
  addressLine3: AddressDataEditedFields
  city: AddressDataEditedFields
  stateCode: AddressDataEditedFields
  zipCode: AddressDataEditedFields
  addressType: AddressDataEditedFields
} = {
  countryCode: 'countryCode',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  addressLine3: 'addressLine3',
  city: 'city',
  stateCode: 'stateCode',
  zipCode: 'zipCode',
  addressType: 'addressType',
}
export type AddressDataEditedFields = 'countryCode' | 'addressLine1' | 'addressLine2' | 'addressLine3' | 'city' | 'stateCode' | 'zipCode' | 'addressType'

type IEditAddressScreen = StackScreenProps<ProfileStackParamList, 'EditAddress'>

const EditAddressScreen: FC<IEditAddressScreen> = ({ navigation, route }) => {
  const { profile, addressUpdated } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { displayTitle, addressType } = route.params

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
    return item ? item === addressTypeFields.overSeasMilitary : false
  }

  const [checkboxSelected, setCheckboxSelected] = useState(getInitialStateForCheckBox(AddressDataEditedFieldValues.addressType))
  const [country, setCountry] = useState(getInitialStateForPicker(AddressDataEditedFieldValues.countryCode, Countries))
  const [addressLine1, setAddressLine1] = useState(getInitialState(AddressDataEditedFieldValues.addressLine1))
  const [addressLine2, setAddressLine2] = useState(getInitialState(AddressDataEditedFieldValues.addressLine2))
  const [addressLine3, setAddressLine3] = useState(getInitialState(AddressDataEditedFieldValues.addressLine3))
  const [militaryPostOffice, setMilitaryPostOffice] = useState(getInitialStateForPicker(AddressDataEditedFieldValues.city, MilitaryPostOffices))
  const [city, setCity] = useState(getInitialState(AddressDataEditedFieldValues.city))
  const [state, setState] = useState(getInitialStateForPicker(AddressDataEditedFieldValues.stateCode, States))
  const [zipCode, setZipCode] = useState(getInitialState(AddressDataEditedFieldValues.zipCode))

  const isDomestic = (countryVal: string): boolean => {
    return countryVal === USA_VALUE || !countryVal
  }

  const getAddressLocationType = (): addressTypes => {
    if (checkboxSelected) {
      return addressTypeFields.overSeasMilitary
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

    const addressData: AddressData = {
      addressLine1,
      addressLine2,
      addressLine3,
      addressPou: addressType === profileAddressOptions.RESIDENTIAL_ADDRESS ? 'RESIDENCE/CHOICE' : 'CORRESPONDENCE',
      addressType: addressLocationType,
      city,
      countryCode: country,
      stateCode: state,
      zipCode,
    }

    if (addressLocationType === addressTypeFields.overSeasMilitary) {
      addressData.city = militaryPostOffice
    }

    dispatch(updateAddress(addressData))
  }

  const doAllItemsExist = (itemsToCheck: Array<string>): boolean => {
    return itemsToCheck.filter(Boolean).length === itemsToCheck.length
  }

  const isSaveButtonDisabled = (): boolean => {
    const addressLocationType = getAddressLocationType()

    switch (addressLocationType) {
      case addressTypeFields.overSeasMilitary:
        return !doAllItemsExist([addressLine1, militaryPostOffice, state, zipCode])
      case addressTypeFields.domestic:
        return !doAllItemsExist([country, addressLine1, city, state, zipCode])
      case addressTypeFields.international:
        return !doAllItemsExist([addressLine1, city, zipCode])
      default:
        return true
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
    if (addressUpdated) {
      dispatch(finishEditAddress())
      navigation.goBack()
    }
  }, [addressUpdated, navigation, dispatch])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: displayTitle,
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'cancel'} testID={'cancel'} showCarat={false} />
      ),
      headerRight: () => <SaveButton onSave={onSave} disabled={isSaveButtonDisabled()} />,
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

  const checkboxPadding: paddingFields = {
    pl: theme.dimensions.editAddressCheckboxPl,
    pt: theme.dimensions.editAddressCheckboxPt,
    pb: theme.dimensions.editAddressCheckboxPb,
  }

  const checkboxProps = {
    label: t('editAddress.liveOnMilitaryBase'),
    selected: checkboxSelected,
    onSelectionChange: onCheckboxChange,
    a11yHint: t('editAddress.liveOnMilitaryBaseA11yHint'),
  }

  const countryPickerProps = getPickerProps(country, onCountryChange, Countries, 'profile:editAddress.country', 'profile:editAddress.countryPlaceholder', 'country-picker')

  const statePickerOptions = checkboxSelected ? MilitaryStates : States
  const statePickerProps = getPickerProps(state, setState, statePickerOptions, 'profile:editAddress.state', 'profile:editAddress.statePlaceholder', 'state-picker')

  const militaryPostOfficePickerProps = getPickerProps(
    militaryPostOffice,
    setMilitaryPostOffice,
    MilitaryPostOffices,
    'profile:editAddress.militaryPostOffices',
    'profile:editAddress.militaryPostOfficesPlaceholder',
    'military-post-office-picker',
  )

  const addressLine1Props = getTextInputProps(
    'none',
    'profile:editAddress.streetAddressLine1',
    addressLine1,
    setAddressLine1,
    'address-line-1-text-input',
    'profile:editAddress.streetAddressPlaceholder',
    MAX_ADDRESS_LENGTH,
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
  )
  const cityProps = getTextInputProps('none', 'profile:editAddress.city', city, setCity, 'city-text-input', 'profile:editAddress.cityPlaceholder')
  const internationalStateProps = getTextInputProps('none', 'profile:editAddress.state', state, setState, 'state-text-input', 'profile:editAddress.state')

  const zipCodeLabel = isDomestic(country) ? 'profile:editAddress.zipCode' : 'profile:editAddress.internationalPostCode'
  const zipCodePlaceHolder = isDomestic(country) ? 'profile:editAddress.zipCodePlaceholder' : 'profile:editAddress.internationalPostCodePlaceholder'
  const zipCodeProps = getTextInputProps('phone', zipCodeLabel, zipCode, setZipCode, 'zipCode-text-input', zipCodePlaceHolder)

  const getCityOrMilitaryBaseComponent = (): ReactNode => {
    return checkboxSelected ? <VAPicker {...militaryPostOfficePickerProps} /> : <VATextInput {...cityProps} />
  }

  const getStates = (): ReactNode => {
    return isDomestic(country) ? <VAPicker {...statePickerProps} /> : <VATextInput {...internationalStateProps} />
  }

  return (
    <ScrollView {...testIdProps('Edit-address-screen')}>
      <KeyboardAvoidingView behavior={isIOS() ? 'position' : undefined} keyboardVerticalOffset={100}>
        <Box mt={theme.dimensions.editAddressMarginTop}>
          <TextArea padding={checkboxPadding}>
            <CheckBox {...checkboxProps} />
          </TextArea>
          <Box mt={theme.dimensions.contentMarginTop}>
            <VAPicker {...countryPickerProps} disabled={checkboxSelected} />
          </Box>
          <TextView variant="TableHeaderBold" ml={theme.dimensions.contentMarginTop} mt={theme.dimensions.editAddressStreetAddressMarginTop}>
            {t('editAddress.streetAddress')}
          </TextView>
          <Box mt={theme.dimensions.editAddressContentMarginTop}>
            <VATextInput {...addressLine1Props} />
            <VATextInput {...addressLine2Props} />
            <VATextInput {...addressLine3Props} />
          </Box>
          <Box mt={theme.dimensions.contentMarginTop}>{getCityOrMilitaryBaseComponent()}</Box>
          <Box mt={theme.dimensions.editAddressContentMarginTop}>{getStates()}</Box>
          <Box mt={theme.dimensions.editAddressContentMarginTop} mb={theme.dimensions.editAddressContentMarginBottom}>
            <VATextInput {...zipCodeProps} />
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}

export default EditAddressScreen
