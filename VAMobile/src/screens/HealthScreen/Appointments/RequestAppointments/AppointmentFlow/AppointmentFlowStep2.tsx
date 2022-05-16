import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'

import { AppointmentFlowModalStackParamList } from '../AppointmentFlowModal'
import AppointmentFlowLayout from './AppointmentFlowLayout'
import AppointmentFlowTitleSection from './AppointmentFlowTitleSection'

type AppointmentFlowStep2Props = StackScreenProps<AppointmentFlowModalStackParamList, 'AppointmentFlowStep2'>

const AppointmentFlowStep2: FC<AppointmentFlowStep2Props> = ({ navigation }) => {
  return (
    <AppointmentFlowLayout
      firstActionButtonPress={() => {
        navigation.goBack()
      }}
      secondActionButtonPress={() => {}}>
      <AppointmentFlowTitleSection title="Page 2" />
    </AppointmentFlowLayout>
  )
}

export default AppointmentFlowStep2
