import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { Box, SaveButton } from 'components'
import { ProfileStackParamList } from '../ProfileStackParamList'

type EditEmailScreenProps = StackScreenProps<ProfileStackParamList, 'EditEmail'>

const EditEmailScreen: FC<EditEmailScreenProps> = ({ navigation }) => {
  const saveEmail = (): void => {
    console.log('saving email')
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <SaveButton onSave={saveEmail} disabled={false} />,
    })
  })

  return <Box />
}

export default EditEmailScreen
