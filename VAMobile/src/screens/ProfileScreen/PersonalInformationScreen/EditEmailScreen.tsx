import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { BackButton, Box, SaveButton } from 'components'
import { ProfileStackParamList } from '../ProfileStackParamList'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'utils/hooks'

type EditEmailScreenProps = StackScreenProps<ProfileStackParamList, 'EditEmail'>

const EditEmailScreen: FC<EditEmailScreenProps> = ({ navigation }) => {
  const t = useTranslation('profile')
  const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)

  const saveEmail = (): void => {
    console.log('saving email')
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'cancel'} showCarat={false} />,
      headerRight: () => <SaveButton onSave={saveEmail} disabled={false} />,
    })
  })

  return <Box />
}

export default EditEmailScreen
