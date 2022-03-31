import { StackScreenProps } from '@react-navigation/stack'
import React, { FC } from 'react'

import { AppointmentFlowModalStackParamList } from '../AppointmentFlowModal'
import { useRouteNavigation } from 'utils/hooks'
import AppointmentFlowLayout from './AppointmentFlowLayout'
import NoMatchInRecords from '../../NoMatchInRecords/NoMatchInRecords'

type AppointmentFlowStep1Props = StackScreenProps<AppointmentFlowModalStackParamList, 'AppointmentFlowStep1'>

const AppointmentFlowStep1: FC<AppointmentFlowStep1Props> = ({ navigation }) => {
  const navigateTo = useRouteNavigation()

  return (
    <AppointmentFlowLayout
      onClose={() => {
        navigation.getParent()?.goBack()
      }}
      secondActionButtonPress={navigateTo('AppointmentFlowStep2')}
      disableFirstAction={true}>
      {/* TODO: Be removed and replaced with actual form */}
      <NoMatchInRecords />
    </AppointmentFlowLayout>
  )
}

export default AppointmentFlowStep1
