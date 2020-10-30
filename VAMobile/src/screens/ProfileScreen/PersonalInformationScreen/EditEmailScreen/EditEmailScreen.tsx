import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton, Box, SaveButton, VATextInput } from 'components'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { ProfileStackParamList } from '../../ProfileScreen'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { finishEditEmail, updateEmail } from 'store/actions'
import { testIdProps } from 'utils/accessibility'

type EditEmailScreenProps = StackScreenProps<ProfileStackParamList, 'EditEmail'>

const validEmailCondition = new RegExp(/\S+@\S+/)

export const isEmailValid = (email: string | undefined): boolean => {
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
  const { profile, emailSaved } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  const [email, setEmail] = useState(profile?.email)
  const [emailIsValid, setEmailIsValid] = useState(false)

  useEffect(() => {
    setEmailIsValid(isEmailValid(email))
  }, [email])

  useEffect(() => {
    if (emailSaved) {
      dispatch(finishEditEmail())
      navigation.goBack()
    }
  }, [emailSaved, navigation, dispatch])

  const saveEmail = (): void => {
    dispatch(updateEmail(email))
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'cancel'} testID={'cancel'} showCarat={false} />
      ),
      headerRight: () => <SaveButton onSave={saveEmail} disabled={!emailIsValid} />,
    })
  })

  return (
    <ScrollView {...testIdProps('Edit-email-screen')}>
      <Box pt={20} display={'flex'}>
        <VATextInput inputType="email" labelKey={'profile:personalInformation.email'} onChange={setEmail} placeholderKey={'profile:personalInformation.email'} value={email} />
      </Box>
    </ScrollView>
  )
}

export default EditEmailScreen
