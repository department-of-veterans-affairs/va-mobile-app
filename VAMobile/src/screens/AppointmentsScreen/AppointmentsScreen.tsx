import { ScrollView, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { getAppointmentsInDateRange } from 'store/actions'

import { Box, SegmentedControl } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useTheme, useTranslation } from 'utils/hooks'
import PastAppointmentDetails from './PastAppointments/PastAppointmentDetails'
import PastAppointments from './PastAppointments/PastAppointments'
import PrepareForVideoVisit from './UpcomingAppointments/PrepareForVideoVisit/PrepareForVideoVisit'
import UpcomingAppointmentDetails from './UpcomingAppointments/UpcomingAppointmentDetails'
import UpcomingAppointments from './UpcomingAppointments/UpcomingAppointments'

export type AppointmentsStackParamList = {
  Appointments: undefined
  UpcomingAppointmentDetails: {
    appointmentID: string
  }
  PrepareForVideoVisit: undefined
  PastAppointmentDetails: {
    appointmentID: string
  }
}

type IAppointmentsScreen = StackScreenProps<AppointmentsStackParamList, 'Appointments'>

const AppointmentsStack = createStackNavigator<AppointmentsStackParamList>()

const AppointmentsScreen: FC<IAppointmentsScreen> = ({}) => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const controlValues = [t('appointmentsTab.upcoming'), t('appointmentsTab.past')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])

  useEffect(() => {
    const todaysDate = new Date()
    const sixMonthsFromToday = new Date(todaysDate.setMonth(todaysDate.getMonth() + 6))
    const threeMonthsEarlier = new Date(todaysDate.setMonth(todaysDate.getMonth() - 3))

    // fetching Upcoming appointments
    dispatch(getAppointmentsInDateRange(todaysDate.toISOString(), sixMonthsFromToday.toISOString()))
    // fetching default past appointment range
    dispatch(getAppointmentsInDateRange(threeMonthsEarlier.toISOString(), todaysDate.toISOString()))
  }, [dispatch])

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
  }

  return (
    <ScrollView contentContainerStyle={scrollStyles}>
      <Box flex={1} justifyContent="flex-start" {...testIdProps('Appointments-screen')}>
        <Box mb={theme.dimensions.marginBetween} mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
          <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} />
        </Box>
        <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
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
      <AppointmentsStack.Screen name="PrepareForVideoVisit" component={PrepareForVideoVisit} />
      <AppointmentsStack.Screen name="PastAppointmentDetails" component={PastAppointmentDetails} options={{ title: t('pastAppointmentDetails.title') }} />
    </AppointmentsStack.Navigator>
  )
}

export default AppointmentsStackScreen
