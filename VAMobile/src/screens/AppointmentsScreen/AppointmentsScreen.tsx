import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import React, { FC, useState } from 'react'

import { Box, SegmentedControl } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useTranslation } from 'utils/hooks'
import PastAppointments from './PastAppointments/PastAppointments'
import UpcomingAppointments from './UpcomingAppointments/UpcomingAppointments'

type AppointmentsStackParamList = {
  Appointments: undefined
}

type IAppointmentsScreen = StackScreenProps<AppointmentsStackParamList, 'Appointments'>

const AppointmentsStack = createStackNavigator<AppointmentsStackParamList>()

const AppointmentsScreen: FC<IAppointmentsScreen> = ({}) => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const controlValues = [t('appointmentsTab.upcoming'), t('appointmentsTab.past')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])

  return (
    <Box flex={1} justifyContent="flex-start" {...testIdProps('Appointments-screen')}>
      <Box m={20}>
        <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} />
      </Box>
      <Box height="100%">
        {selectedTab === t('appointmentsTab.past') && <PastAppointments />}
        {selectedTab === t('appointmentsTab.upcoming') && <UpcomingAppointments />}
      </Box>
    </Box>
  )
}

type IAppointmentsStackScreen = {}

const AppointmentsStackScreen: FC<IAppointmentsStackScreen> = () => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const headerStyles = useHeaderStyles()

  return (
    <AppointmentsStack.Navigator screenOptions={headerStyles}>
      <AppointmentsStack.Screen name="Appointments" component={AppointmentsScreen} options={{ title: t('title') }} />
    </AppointmentsStack.Navigator>
  )
}

export default AppointmentsStackScreen
