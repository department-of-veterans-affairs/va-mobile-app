import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, ReactNode } from 'react'

import { AppointmentFlowModalStackParamList } from '../AppointmentFlowModal'
import { Box, SimpleList, SimpleListItemObj } from 'components'
import { useRouteNavigation } from 'utils/hooks'
import AppointmentFlowLayout from './AppointmentFlowLayout'
import TextView from 'components/TextView'

type AppointmentFlowStep3Props = StackScreenProps<AppointmentFlowModalStackParamList, 'AppointmentFlowStep3'>

const AppointmentFlowStep3: FC<AppointmentFlowStep3Props> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()

  const debugMenu = (): ReactNode => {
    const onGoToStep2 = navigateTo('AppointmentFlowStep2')
    const onGoToStep1 = navigateTo('AppointmentFlowStep1')
    const debugButton: Array<SimpleListItemObj> = [
      {
        text: 'Go to step 2',
        onPress: onGoToStep2,
      },
      {
        text: 'Go to step 1',
        onPress: onGoToStep1,
      },
    ]

    return (
      <Box mt={10}>
        <SimpleList items={debugButton} />
      </Box>
    )
  }

  return (
    <AppointmentFlowLayout
      onClose={() => {
        navigation.getParent()?.goBack()
      }}>
      {/* TODO: Be removed and replaced with actual form */}
      <>
        <TextView pl={10}>{'Step3'}</TextView>
        <Box px={15}>{debugMenu()}</Box>
      </>
    </AppointmentFlowLayout>
  )
}

export default AppointmentFlowStep3
