import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { BackButton, Box, SaveButton, TextView, VATextInput } from 'components'
import { ProfileStackParamList } from '../ProfileScreen'
import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'utils/hooks'

type EditEmailScreenProps = StackScreenProps<ProfileStackParamList, 'EditEmail'>

const isEmailValid = (email: string | undefined) => {
  return true
}

const EditEmailScreen: FC<EditEmailScreenProps> = ({ navigation }) => {
  const t = useTranslation('profile')
  const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)

  const [email, setEmail] = useState(profile?.email)
  const [emailIsValid, setEmailIsValid] = useState(false)

  useEffect(() => {
    setEmailIsValid(isEmailValid(email))
  }, [email])

  const saveEmail = (): void => {
    console.log('saving email')
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'cancel'} showCarat={false} />,
      headerRight: () => <SaveButton onSave={saveEmail} disabled={!emailIsValid} />,
    })
  })

  return (
    <Box pt={20} display={'flex'}>
      {/*<TextView>{email}</TextView>*/}
      <VATextInput inputType="email" labelKey={'profile:personalInformation.email'} onChange={setEmail} placeholderKey={'profile:personalInformation.email'} />
    </Box>
  )
}

export default EditEmailScreen
