import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'

import { AppointmentFlowModalStackParamList } from '../AppointmentFlowModal'
import { useRouteNavigation } from 'utils/hooks'
import AppointmentFlowLayout from './AppointmentFlowLayout'
import NoAppointments from '../../NoAppointments'

type AppointmentFlowStep2Props = StackScreenProps<AppointmentFlowModalStackParamList, 'AppointmentFlowStep2'>

const AppointmentFlowStep2: FC<AppointmentFlowStep2Props> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()
  return (
    <AppointmentFlowLayout
      onClose={() => {
        navigation.getParent()?.goBack()
      }}
      firstActionButtonPress={() => {
        navigation.goBack()
      }}
      secondActionButtonPress={navigateTo('AppointmentFlowStep3')}>
      {/* TODO: Be removed and replaced with actual form */}
      <NoAppointments subText={''} />
    </AppointmentFlowLayout>
  )
}

export default AppointmentFlowStep2
