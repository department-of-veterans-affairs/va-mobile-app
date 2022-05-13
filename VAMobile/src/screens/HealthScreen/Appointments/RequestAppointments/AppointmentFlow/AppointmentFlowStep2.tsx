import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'

import { AppointmentFlowModalStackParamList } from '../AppointmentFlowModal'
import AppointmentFlowLayout from './AppointmentFlowLayout'

type AppointmentFlowStep2Props = StackScreenProps<AppointmentFlowModalStackParamList, 'AppointmentFlowStep2'>

const AppointmentFlowStep2: FC<AppointmentFlowStep2Props> = ({ navigation }) => {
  return (
    <AppointmentFlowLayout
      pageTitle="Page 2"
      firstActionButtonPress={() => {
        navigation.goBack()
      }}
      secondActionButtonPress={() => {}}
    />
  )
}

export default AppointmentFlowStep2
