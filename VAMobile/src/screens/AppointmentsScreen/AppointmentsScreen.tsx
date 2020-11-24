import { ScrollView } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import React, { FC, useState } from 'react'

import { AppointmentLocation, AppointmentTimeZone, AppointmentType } from 'store/api/types'
import { Box, SegmentedControl } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useTheme, useTranslation } from 'utils/hooks'
import PastAppointments from './PastAppointments/PastAppointments'
import UpcomingAppointmentDetails from './UpcomingAppointments/UpcomingAppointmentDetails'
import UpcomingAppointments from './UpcomingAppointments/UpcomingAppointments'

export type CalendarData = {
  title: string
  startTime: string
  minutesDuration: number
  timeZone: AppointmentTimeZone
  locationName: string
}

export type AppointmentsStackParamList = {
  Appointments: undefined
  UpcomingAppointmentDetails: {
    appointmentType: AppointmentType
    calendarData: CalendarData
    healthcareService: string
    location: AppointmentLocation
  }
}

type IAppointmentsScreen = StackScreenProps<AppointmentsStackParamList, 'Appointments'>

const AppointmentsStack = createStackNavigator<AppointmentsStackParamList>()

const AppointmentsScreen: FC<IAppointmentsScreen> = ({}) => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()
  const controlValues = [t('appointmentsTab.upcoming'), t('appointmentsTab.past')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])

  return (
    <ScrollView>
      <Box flex={1} justifyContent="flex-start" {...testIdProps('Appointments-screen')}>
        <Box m={theme.dimensions.marginBetween}>
          <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} />
        </Box>
        <Box height="100%">
          {selectedTab === t('appointmentsTab.past') && <PastAppointments />}
          {selectedTab === t('appointmentsTab.upcoming') && <UpcomingAppointments />}
        </Box>
      </Box>
    </ScrollView>
  )
}

type IAppointmentsStackScreen = {}

const AppointmentsStackScreen: FC<IAppointmentsStackScreen> = () => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const headerStyles = useHeaderStyles()

  return (
    <AppointmentsStack.Navigator screenOptions={headerStyles}>
      <AppointmentsStack.Screen name="Appointments" component={AppointmentsScreen} options={{ title: t('title') }} />
      <AppointmentsStack.Screen name="UpcomingAppointmentDetails" component={UpcomingAppointmentDetails} options={{ title: t('appointments.appointment') }} />
    </AppointmentsStack.Navigator>
  )
}

export default AppointmentsStackScreen
