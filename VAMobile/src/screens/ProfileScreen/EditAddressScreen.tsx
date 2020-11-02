import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton, Box, CheckBox, SaveButton, TextArea, TextView, VAPicker, VATextInput } from 'components'
import { Countries } from 'constants/countries'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from './ProfileScreen'
import { States } from 'constants/states'
import { useTranslation } from 'utils/hooks'

const MAX_ADDRESS_LENGTH = 35

type IEditAddressScreen = StackScreenProps<ProfileStackParamList, 'EditAddress'>

const EditAddressScreen: FC<IEditAddressScreen> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const { displayTitle } = route.params

  const [checkboxSelected, setCheckboxSelected] = useState(false)
  const [countrySelected, setCountrySelected] = useState('')
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

  return (
    <ScrollView>
      <Box mt={12}>
        <TextArea padding={{ pl: 20, pt: 20, pb: 18 }}>
          <CheckBox label={t('editAddress.liveOnMilitaryBase')} selected={checkboxSelected} onSelectionChange={setCheckboxSelected} />
        </TextArea>
        <Box mt={20}>
          <VAPicker
            selectedValue={countrySelected}
            onSelectionChange={setCountrySelected}
            pickerOptions={Countries}
            labelKey="profile:editAddress.country"
            placeholderKey="profile:editAddress.countryPlaceholder"
          />
        </Box>
        <TextView variant="TableHeaderBold" ml={20} mt={16}>
          {t('editAddress.streetAddress')}
        </TextView>
        <Box mt={10}>
          <VATextInput
            inputType="none"
            labelKey="profile:editAddress.streetAddressLine1"
            value={addressLine1}
            onChange={setAddressLine1}
            maxLength={MAX_ADDRESS_LENGTH}
            placeholderKey="profile:editAddress.streetAddressPlaceholder"
          />
          <VATextInput inputType="none" labelKey="profile:editAddress.streetAddressLine2" value={addressLine2} onChange={setAddressLine2} maxLength={MAX_ADDRESS_LENGTH} />
          <VATextInput inputType="none" labelKey="profile:editAddress.streetAddressLine3" value={addressLine3} onChange={setAddressLine3} maxLength={MAX_ADDRESS_LENGTH} />
        </Box>
        <Box mt={20}>
          <VATextInput inputType="none" labelKey="profile:editAddress.city" value={city} onChange={setCity} placeholderKey="profile:editAddress.cityPlaceholder" />
        </Box>
        <Box mt={10}>
          <VAPicker
            selectedValue={state}
            onSelectionChange={setState}
            pickerOptions={States}
            labelKey="profile:editAddress.state"
            placeholderKey="profile:editAddress.statePlaceholder"
          />
        </Box>
        <Box mt={10} mb={10}>
          <VATextInput inputType="phone" labelKey="profile:editAddress.zipCode" value={zipCode} onChange={setZipCode} placeholderKey="profile:editAddress.zipCodePlaceholder" />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default EditAddressScreen
