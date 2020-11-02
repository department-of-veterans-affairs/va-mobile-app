import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton, Box, CheckBox, PickerItem, SaveButton, TextArea, TextView, VAPicker, VAPickerProps, VATextInput, VATextInputProps, VATextInputTypes } from 'components'
import { Countries } from 'constants/countries'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { ProfileStackParamList } from './ProfileScreen'
import { States } from 'constants/states'
import { useTranslation } from 'utils/hooks'

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
): VAPickerProps => {
  return {
    selectedValue,
    onSelectionChange,
    pickerOptions,
    labelKey,
    placeholderKey,
  }
}

const MAX_ADDRESS_LENGTH = 35

type IEditAddressScreen = StackScreenProps<ProfileStackParamList, 'EditAddress'>

const EditAddressScreen: FC<IEditAddressScreen> = ({ navigation, route }) => {
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const t = useTranslation(NAMESPACE.PROFILE)
  const { displayTitle } = route.params

  const [checkboxSelected, setCheckboxSelected] = useState(false)
  const [country, setCountry] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [addressLine3, setAddressLine3] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')

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

  const checkboxProps = {
    label: t('editAddress.liveOnMilitaryBase'),
    selected: checkboxSelected,
    onSelectionChange: setCheckboxSelected,
  }

  const countryPickerProps = getPickerProps(country, setCountry, Countries, 'profile:editAddress.country', 'profile:editAddress.countryPlaceholder')
  const statePickerProps = getPickerProps(state, setState, States, 'profile:editAddress.state', 'profile:editAddress.statePlaceholder')

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
      <Box mt={12}>
        <TextArea padding={{ pl: 20, pt: 20, pb: 18 }}>
          <CheckBox {...checkboxProps} />
        </TextArea>
        <Box mt={20}>
          <VAPicker {...countryPickerProps} />
        </Box>
        <TextView variant="TableHeaderBold" ml={20} mt={16}>
          {t('editAddress.streetAddress')}
        </TextView>
        <Box mt={10}>
          <VATextInput {...addressLine1Props} />
          <VATextInput {...addressLine2Props} />
          <VATextInput {...addressLine3Props} />
        </Box>
        <Box mt={20}>
          <VATextInput {...cityProps} />
        </Box>
        <Box mt={10}>
          <VAPicker {...statePickerProps} />
        </Box>
        <Box mt={10} mb={10}>
          <VATextInput {...zipCodeProps} />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default EditAddressScreen
