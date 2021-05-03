import { BackButton, Box, TextView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import React, { FC, ReactNode, useEffect } from 'react'

type ReplyCancelConfirmationProps = StackScreenProps<HealthStackParamList, 'ReplyCancelConfirmation'>

const ReplyCancelConfirmation: FC<ReplyCancelConfirmationProps> = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  return (
    <Box>
      <TextView>{'PLACEHOLDER FOR REPLY CANCEL CONFIRMATION SCREEN'}</TextView>
    </Box>
  )
}
export default ReplyCancelConfirmation
