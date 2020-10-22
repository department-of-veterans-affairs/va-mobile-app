import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC } from 'react'

import { Box, SaveButton } from 'components'
import { ProfileStackParamList } from '../ProfileStackParamList'

// type SaveButtonProps = {
//   onSave: () => void
//   disabled: boolean
// }
//
// const getSaveButton: FC<SaveButtonProps> = ({ onSave, disabled }) => {
//   return (<SaveButton onSave={onSave} disabled={disabled} />)
// }

type EditEmailScreenProps = StackScreenProps<ProfileStackParamList, 'EditEmail'>

const EditEmailScreen: FC<EditEmailScreenProps> = ({ navigation }) => {
  const saveEmail = (): void => {
    console.log('saving email')
  }

  navigation.setOptions({
    headerRight: () => <SaveButton onSave={saveEmail} disabled={false} />,
  })

  return <Box />
}

export default EditEmailScreen
