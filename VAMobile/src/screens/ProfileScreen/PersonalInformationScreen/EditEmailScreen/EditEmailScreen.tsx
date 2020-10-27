import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { AuthState, PersonalInformationState, StoreState } from 'store/reducers'
import { BackButton, Box, SaveButton, VATextInput } from 'components'
import { ProfileStackParamList } from '../../ProfileScreen'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { updateEmail } from 'store/actions'
import { useSelector } from 'react-redux'

type EditEmailScreenProps = StackScreenProps<ProfileStackParamList, 'EditEmail'>

const validEmailCondition = new RegExp(/\S+@\S+/)

const isEmailValid = (email: string | undefined): boolean => {
  // We allow the saving of an empty string or if the format matches "X@X"
  if (!email) {
    return true
  }

  return validEmailCondition.test(email)
}

/**
 * Screen for editing a users email in the personal info section
 */
const EditEmailScreen: FC<EditEmailScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch()
  const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)
  const { emailSaved } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  const [email, setEmail] = useState(profile?.email)
  const [emailIsValid, setEmailIsValid] = useState(false)

  useEffect(() => {
    setEmailIsValid(isEmailValid(email))
  }, [email])

  useEffect(() => {
    if (emailSaved) {
      navigation.goBack()
    }
  }, [emailSaved, navigation])

  const saveEmail = (): void => {
    dispatch(updateEmail(email))
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'cancel'} showCarat={false} />,
      headerRight: () => <SaveButton onSave={saveEmail} disabled={!emailIsValid} />,
    })
  })

  return (
    <ScrollView>
      <Box pt={20} display={'flex'}>
        <VATextInput inputType="email" labelKey={'profile:personalInformation.email'} onChange={setEmail} placeholderKey={'profile:personalInformation.email'} value={email} />
      </Box>
    </ScrollView>
  )
}

export default EditEmailScreen
