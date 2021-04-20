import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton, Box, TextView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'

type ReplyMessageProps = StackScreenProps<HealthStackParamList, 'ComposeMessage'>

const ReplyMessage: FC<ReplyMessageProps> = ({ navigation, route }) => {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  return (
    <Box>
      <TextView>{'PLACEHOLDER for Reply form'}</TextView>
    </Box>
  )
}

export default ReplyMessage
