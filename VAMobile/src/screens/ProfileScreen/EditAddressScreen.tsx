import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

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
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { ProfileStackParamList } from './ProfileScreen'
import { States } from 'constants/states'
import { useTheme, useTranslation } from 'utils/hooks'

const getTextInputProps = (
  inputType: VATextInputTypes,
  labelKey: string,
  value: string,
  onChange: (text: string) => void,
  placeholderKey?: string,
  maxLength?: number | undefined,
): VATextInputProps => {
  return {
    inputType,
    labelKey,
    value,
    onChange,
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

export type addressDataEditedFields = 'countryCode' | 'addressLine1' | 'addressLine2' | 'addressLine3' | 'city' | 'stateCode' | 'zipCode'

type IEditAddressScreen = StackScreenProps<ProfileStackParamList, 'EditAddress'>

const EditAddressScreen: FC<IEditAddressScreen> = ({ navigation, route }) => {
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const { displayTitle, addressType } = route.params

  const getInitialState = (itemToGet: addressDataEditedFields): string => {
    const item = profile?.[addressType]?.[itemToGet]
    return item ? item : ''
  }

  const getInitialStateForPicker = (itemToGet: addressDataEditedFields, listToSearch: Array<PickerItem>): string => {
    const item = getInitialState(itemToGet)
    const found = listToSearch.find((obj) => obj.value === item)
    return found ? found.value : ''
  }

  const [checkboxSelected, setCheckboxSelected] = useState(false)
  const [country, setCountry] = useState(getInitialStateForPicker('countryCode', Countries))
  const [addressLine1, setAddressLine1] = useState(getInitialState('addressLine1'))
  const [addressLine2, setAddressLine2] = useState(getInitialState('addressLine2'))
  const [addressLine3, setAddressLine3] = useState(getInitialState('addressLine3'))
  const [city, setCity] = useState(getInitialState('city'))
  const [state, setState] = useState(getInitialStateForPicker('stateCode', States))
  const [zipCode, setZipCode] = useState(getInitialState('zipCode'))

  const onSave = (): void => {}

  useEffect(() => {
    navigation.setOptions({
      headerTitle: displayTitle,
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'cancel'} testID={'cancel'} showCarat={false} />
      ),
      headerRight: () => <SaveButton onSave={onSave} disabled={true} />,
    })
  })

  const checkboxPadding: paddingFields = {
    pl: theme.dimensions.editAddressCheckboxPl,
    pt: theme.dimensions.editAddressCheckboxPt,
    pb: theme.dimensions.editAddressCheckboxPb,
  }

  const checkboxProps = {
    label: t('editAddress.liveOnMilitaryBase'),
    selected: checkboxSelected,
    onSelectionChange: setCheckboxSelected,
  }

  const countryPickerProps = getPickerProps(country, setCountry, Countries, 'profile:editAddress.country', 'profile:editAddress.countryPlaceholder', 'country-picker')
  const statePickerProps = getPickerProps(state, setState, States, 'profile:editAddress.state', 'profile:editAddress.statePlaceholder', 'state-picker')

  const addressLine1Props = getTextInputProps(
    'none',
    'profile:editAddress.streetAddressLine1',
    addressLine1,
    setAddressLine1,
    'profile:editAddress.streetAddressPlaceholder',
    MAX_ADDRESS_LENGTH,
  )
  const addressLine2Props = getTextInputProps('none', 'profile:editAddress.streetAddressLine2', addressLine2, setAddressLine2, undefined, MAX_ADDRESS_LENGTH)
  const addressLine3Props = getTextInputProps('none', 'profile:editAddress.streetAddressLine3', addressLine3, setAddressLine3, undefined, MAX_ADDRESS_LENGTH)
  const cityProps = getTextInputProps('none', 'profile:editAddress.city', city, setCity, 'profile:editAddress.cityPlaceholder')
  const zipCodeProps = getTextInputProps('phone', 'profile:editAddress.zipCode', zipCode, setZipCode, 'profile:editAddress.zipCodePlaceholder')

  return (
    <ScrollView>
      <Box mt={theme.dimensions.editAddressMarginTop}>
        <TextArea padding={checkboxPadding}>
          <CheckBox {...checkboxProps} />
        </TextArea>
        <Box mt={theme.dimensions.contentMarginTop}>
          <VAPicker {...countryPickerProps} />
        </Box>
        <TextView variant="TableHeaderBold" ml={theme.dimensions.contentMarginTop} mt={theme.dimensions.editAddressStreetAddressMarginTop}>
          {t('editAddress.streetAddress')}
        </TextView>
        <Box mt={theme.dimensions.editAddressContentMarginTop}>
          <VATextInput {...addressLine1Props} />
          <VATextInput {...addressLine2Props} />
          <VATextInput {...addressLine3Props} />
        </Box>
        <Box mt={theme.dimensions.contentMarginTop}>
          <VATextInput {...cityProps} />
        </Box>
        <Box mt={theme.dimensions.editAddressContentMarginTop}>
          <VAPicker {...statePickerProps} />
        </Box>
        <Box mt={theme.dimensions.editAddressContentMarginTop} mb={theme.dimensions.editAddressContentMarginBottom}>
          <VATextInput {...zipCodeProps} />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default EditAddressScreen
