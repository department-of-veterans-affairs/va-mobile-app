import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton } from 'components/BackButton'
import { Box, SaveButton, TextView, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from '../../ProfileScreen'
import { editUsersNumber } from 'store/actions'
import { useTranslation } from 'utils/hooks'

const MAX_DIGITS = 10
const MAX_DIGITS_AFTER_FORMAT = 14

type IEditPhoneNumberScreen = StackScreenProps<ProfileStackParamList, 'EditPhoneNumber'>

const EditPhoneNumberScreen: FC<IEditPhoneNumberScreen> = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const { displayTitle, phoneType } = route.params

  const [phoneNumber, setPhoneNumber] = useState('')
  const [extension, setExtension] = useState('')
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false)

  const getOnlyNumbersFromString = (text: string): string => {
    return text.replace(/\D/g, '')
  }

  const onSave = (): void => {
    const onlyDigitsNum = getOnlyNumbersFromString(phoneNumber)
    dispatch(editUsersNumber(phoneType, onlyDigitsNum, extension, false))
  }

  const setPhoneNumberOnChange = (text: string): void => {
    const onlyDigitsNum = getOnlyNumbersFromString(text)

    if (onlyDigitsNum.length === 0 || onlyDigitsNum.length === MAX_DIGITS) {
      setSaveButtonDisabled(false)
    } else {
      setSaveButtonDisabled(true)
    }

    if (onlyDigitsNum.length <= MAX_DIGITS) {
      setPhoneNumber(text)
    }
  }

  const onEndEditingPhoneNumber = (): void => {
    const onlyDigitsNum = getOnlyNumbersFromString(phoneNumber)

    if (onlyDigitsNum.length === MAX_DIGITS) {
      const formattedPhoneNumber = `(${onlyDigitsNum.substring(0, 3)})-${onlyDigitsNum.substring(3, 6)}-${onlyDigitsNum.substring(6)}`
      setPhoneNumber(formattedPhoneNumber)
    } else {
      setPhoneNumber(onlyDigitsNum)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: displayTitle,
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'cancel'} showCarat={false} />,
      headerRight: () => <SaveButton onSave={onSave} disabled={saveButtonDisabled} />,
    })
  })

  return (
    <ScrollView>
      <Box mt={20}>
        <VATextInput
          inputType="phone"
          labelKey="profile:editPhoneNumber.number"
          onChange={(text): void => setPhoneNumberOnChange(text)}
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
        onChange={(text): void => setExtension(text)}
        placeholderKey={'profile:editPhoneNumber.extension'}
        value={extension}
      />
    </ScrollView>
  )
}

export default EditPhoneNumberScreen
