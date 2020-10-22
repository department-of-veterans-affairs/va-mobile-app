import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC } from 'react'

import { Box } from 'components'
import { ProfileStackParamList } from '../ProfileStackParamList'

type EditEmailScreenProps = StackScreenProps<ProfileStackParamList, 'EditEmail'>

const EditEmailScreen: FC<EditEmailScreenProps> = ({ navigation }) => {
  // navigation.setOptions({
  //   headerRight: () =>
  // })

  return <Box />
}

export default EditEmailScreen
