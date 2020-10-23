import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton } from 'components/BackButton'
import { Box, SaveButton, TextView, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileScreen'
import { ScrollView } from 'react-native'
import { useTranslation } from 'utils/hooks'

const MAX_DIGITS = 10
const MAX_DIGITS_AFTER_FORMAT = 14

type IEditPhoneNumberScreen = StackScreenProps<ProfileStackParamList, 'EditPhoneNumber'>

const EditPhoneNumberScreen: FC<IEditPhoneNumberScreen> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const { displayTitle } = route.params

  const [phoneNumber, setPhoneNumber] = useState('')
  const [extension, setExtension] = useState('')

  useEffect(() => {
    navigation.setOptions({
      headerTitle: displayTitle,
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'cancel'} showCarat={false} />,
      headerRight: () => <SaveButton onSave={() => {}} disabled={false} />,
    })
  })

  const onEndEditingPhoneNumber = () => {
    if (phoneNumber.length === MAX_DIGITS) {
      const formattedPhoneNumber = `(${phoneNumber.substring(0, 3)})-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`
      setPhoneNumber(formattedPhoneNumber)
    }
  }

  return (
    <ScrollView>
      <Box mt={20}>
        <VATextInput
          inputType="phone"
          labelKey="profile:editPhoneNumber.number"
          onChange={(text) => setPhoneNumber(text)}
          placeholderKey={'profile:editPhoneNumber.number'}
          maxLength={MAX_DIGITS_AFTER_FORMAT}
          value={phoneNumber}
          onEndEditing={onEndEditingPhoneNumber}
        />
      </Box>
      <TextView variant="TableHeaderLabel" mx={20} mt={12} mb={19}>
        {t('editPhoneNumber.weCanOnlySupportUSNumbers')}
      </TextView>
      <VATextInput
        inputType="phone"
        labelKey="profile:editPhoneNumber.extension"
        onChange={(text) => setExtension(text)}
        placeholderKey={'profile:editPhoneNumber.extension'}
        maxLength={MAX_DIGITS_AFTER_FORMAT}
        value={extension}
      />
    </ScrollView>
  )
}

export default EditPhoneNumberScreen
