import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton } from 'components/BackButton'
import { Box, SaveButton, TextView, VATextInput } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { RootNavStackParamList } from 'App'
import { editUsersNumber, finishEditPhoneNumber } from 'store/actions'
import { formatPhoneNumber, getNumbersFromString } from 'utils/formattingUtils'
import { getFormattedPhoneNumber } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const MAX_DIGITS = 10
const MAX_DIGITS_AFTER_FORMAT = 14

type IEditPhoneNumberScreen = StackScreenProps<RootNavStackParamList, 'EditPhoneNumber'>

const EditPhoneNumberScreen: FC<IEditPhoneNumberScreen> = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const { displayTitle, phoneType, phoneData } = route.params

  const [extension, setExtension] = useState('')
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(getFormattedPhoneNumber(phoneData))

  const { phoneNumberUpdated } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  useEffect(() => {
    if (phoneNumberUpdated) {
      navigation.goBack()
      dispatch(finishEditPhoneNumber())
    }
  }, [phoneNumberUpdated, navigation, dispatch])

  useEffect(() => {
    const onlyDigitsNum = getNumbersFromString(phoneNumber)
    const isEmptyFields = onlyDigitsNum.length === 0 && extension === ''

    if (isEmptyFields || onlyDigitsNum.length === MAX_DIGITS) {
      setSaveButtonDisabled(false)
    } else {
      setSaveButtonDisabled(true)
    }
  }, [phoneNumber, extension])

  const onSave = (): void => {
    const onlyDigitsNum = getNumbersFromString(phoneNumber)
    const numberId = phoneData ? phoneData.id : 0 // TODO: consider case when id does not exist

    dispatch(editUsersNumber(phoneType, onlyDigitsNum, extension, numberId))
  }

  const setPhoneNumberOnChange = (text: string): void => {
    // Retrieve only digits from text input
    const onlyDigitsNum = getNumbersFromString(text)

    // if there are 10 or less digits, update the text input value of phone number to the incoming text
    if (onlyDigitsNum.length <= MAX_DIGITS) {
      setPhoneNumber(text)
    }
  }

  const onEndEditingPhoneNumber = (): void => {
    // Retrieve only digits from text input
    const onlyDigitsNum = getNumbersFromString(phoneNumber)

    // if there are 10 digits display the formatted phone number
    // otherwise, display just the number
    if (onlyDigitsNum.length === MAX_DIGITS) {
      const formattedPhoneNumber = formatPhoneNumber(onlyDigitsNum)
      setPhoneNumber(formattedPhoneNumber)
    } else {
      setPhoneNumber(onlyDigitsNum)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: displayTitle,
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'cancel'} testID={'cancel'} showCarat={false} />
      ),
      headerRight: () => <SaveButton onSave={onSave} disabled={saveButtonDisabled} />,
    })
  })

  return (
    <ScrollView {...testIdProps('Edit-number-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
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
        <TextView variant="TableHeaderLabel" mx={theme.dimensions.gutter} mt={theme.dimensions.titleHeaderAndElementMargin} mb={theme.dimensions.marginBetween}>
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
      </Box>
    </ScrollView>
  )
}

export default EditPhoneNumberScreen
