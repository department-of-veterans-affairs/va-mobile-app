import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton, Box, ErrorComponent, LoadingComponent, SaveButton, VATextInput } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { RootNavStackParamList } from 'App'
import { ScreenIDs } from 'constants/screens'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { finishEditEmail, updateEmail } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'

type EditEmailScreenProps = StackScreenProps<RootNavStackParamList, 'EditEmail'>

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
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const { profile, emailSaved, loading } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const emailId = profile?.contactEmail?.id

  const [email, setEmail] = useState(profile?.contactEmail?.emailAddress)
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
    dispatch(updateEmail(email, emailId, ScreenIDs.EDIT_EMAIL_SCREEN_ID))
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
      headerRight: () => <SaveButton onSave={saveEmail} disabled={!emailIsValid} />,
    })
  })

  if (useError(ScreenIDs.EDIT_EMAIL_SCREEN_ID)) {
    return <ErrorComponent />
  }

  if (loading || emailSaved) {
    return <LoadingComponent text={t('personalInformation.savingEmailAddress')} />
  }

  return (
    <ScrollView {...testIdProps('Edit-email-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} display={'flex'}>
        <VATextInput
          inputType="email"
          labelKey={'profile:personalInformation.email'}
          onChange={setEmail}
          placeholderKey={'profile:personalInformation.email'}
          value={email}
          testID="email-text-input"
        />
      </Box>
    </ScrollView>
  )
}

export default EditEmailScreen
