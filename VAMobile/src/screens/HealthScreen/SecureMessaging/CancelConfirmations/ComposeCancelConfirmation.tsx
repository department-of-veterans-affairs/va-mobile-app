import { Box, TextView } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'

type ComposeCancelConfirmationProps = StackScreenProps<HealthStackParamList, 'ComposeCancelConfirmation'>

const ComposeCancelConfirmation: FC<ComposeCancelConfirmationProps> = ({ navigation, route }) => {
  return (
    <Box>
      <TextView>{'PLACEHOLDER FOR CANCEL CONFIRMATION SCREEN'}</TextView>
    </Box>
  )
}
export default ComposeCancelConfirmation
