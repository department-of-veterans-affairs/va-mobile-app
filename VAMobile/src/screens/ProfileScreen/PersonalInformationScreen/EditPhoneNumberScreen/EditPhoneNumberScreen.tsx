import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton } from 'components/BackButton'
import { Box, SaveButton, TextView, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { ProfileStackParamList } from '../../ProfileScreen'
import { editUsersNumber, finishEditPhoneNumber } from 'store/actions'
import { formatPhoneNumber } from 'utils/formattingUtils'
import { getFormattedPhoneNumber } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'utils/hooks'

const MAX_DIGITS = 10
const MAX_DIGITS_AFTER_FORMAT = 14

type IEditPhoneNumberScreen = StackScreenProps<ProfileStackParamList, 'EditPhoneNumber'>

const EditPhoneNumberScreen: FC<IEditPhoneNumberScreen> = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.PROFILE)
  const { displayTitle, phoneType, phoneData } = route.params

  const [extension, setExtension] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(getFormattedPhoneNumber(phoneData))

  const { phoneNumberUpdated } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  useEffect(() => {
    if (phoneNumberUpdated) {
      navigation.goBack()
      dispatch(finishEditPhoneNumber())
    }
  }, [phoneNumberUpdated, navigation, dispatch])

  const getOnlyNumbersFromString = (text: string): string => {
    return text.replace(/\D/g, '')
  }

  const onSave = (): void => {
    const onlyDigitsNum = getOnlyNumbersFromString(phoneNumber)
    const numberId = phoneData ? phoneData.id : 0 // TODO: consider case when id does not exist

    dispatch(editUsersNumber(phoneType, onlyDigitsNum, extension, numberId, false))
  }

  const setPhoneNumberOnChange = (text: string): void => {
    // Retrieve only digits from text input
    const onlyDigitsNum = getOnlyNumbersFromString(text)

    // if there are 10 or less digits, update the text input value of phone number to the incoming text
    if (onlyDigitsNum.length <= MAX_DIGITS) {
      setPhoneNumber(text)
    }
  }

  const onEndEditingPhoneNumber = (): void => {
    // Retrieve only digits from text input
    const onlyDigitsNum = getOnlyNumbersFromString(phoneNumber)

    // if there are 10 digits display the formatted phone number
    // otherwise, display just the number
    if (onlyDigitsNum.length === MAX_DIGITS) {
      const formattedPhoneNumber = formatPhoneNumber(onlyDigitsNum)
      setPhoneNumber(formattedPhoneNumber)
    } else {
      setPhoneNumber(onlyDigitsNum)
    }
  }

  const isSaveButtonDisabled = (): boolean => {
    const onlyDigitsNum = getOnlyNumbersFromString(phoneNumber)

    // enable the save button if both the phone number and extension are blank or if the phone number has 10 digits
    return !((onlyDigitsNum.length === 0 && extension.length === 0) || onlyDigitsNum.length === MAX_DIGITS)
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: displayTitle,
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'cancel'} testID={'cancel'} showCarat={false} />
      ),
      headerRight: () => <SaveButton onSave={onSave} disabled={isSaveButtonDisabled()} />,
    })
  })

  return (
    <ScrollView {...testIdProps('Edit-number-screen')}>
      <Box mt={20}>
        <VATextInput
          inputType="phone"
          labelKey="profile:editPhoneNumber.number"
          onChange={(text): void => setPhoneNumberOnChange(text)}
          placeholderKey={'profile:editPhoneNumber.number'}
          maxLength={MAX_DIGITS_AFTER_FORMAT}
          value={phoneNumber}
          onEndEditing={onEndEditingPhoneNumber}
          testID="number-text-input"
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
        testID="extension-text-input"
      />
    </ScrollView>
  )
}

export default EditPhoneNumberScreen
