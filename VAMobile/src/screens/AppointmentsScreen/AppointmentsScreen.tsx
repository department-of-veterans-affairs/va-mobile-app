import { DateTime } from 'luxon'
import { ScrollView, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect, useState } from 'react'

import { AppointmentsDateRange, prefetchAppointments } from 'store/actions'

import { AlertBox, Box, ErrorComponent, SegmentedControl } from 'components'
import { AppointmentsStackParamList } from './AppointmentStackScreens'
import { AppointmentsState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { testIdProps } from 'utils/accessibility'
import { useError, useHeaderStyles, useTheme, useTranslation } from 'utils/hooks'
import PastAppointments from './PastAppointments/PastAppointments'
import UpcomingAppointments from './UpcomingAppointments/UpcomingAppointments'

type AppointmentsScreenProps = StackScreenProps<AppointmentsStackParamList, 'Appointments'>

const AppointmentsScreen: FC<AppointmentsScreenProps> = ({}) => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const controlValues = [t('appointmentsTab.upcoming'), t('appointmentsTab.past')]
  const a11yHints = [t('appointmentsTab.upcoming.a11yHint'), t('appointmentsTab.past.a11yHint')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])
  const { upcomingVaServiceError, upcomingCcServiceError, pastVaServiceError, pastCcServiceError } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  useEffect(() => {
    const todaysDate = DateTime.local()
    const sixMonthsFromToday = todaysDate.plus({ months: 6 })
    const threeMonthsEarlier = todaysDate.minus({ months: 3 })

    const upcomingRange: AppointmentsDateRange = {
      startDate: todaysDate.startOf('day').toISO(),
      endDate: sixMonthsFromToday.endOf('day').toISO(),
    }
    const pastRange: AppointmentsDateRange = {
      startDate: threeMonthsEarlier.startOf('day').toISO(),
      endDate: todaysDate.minus({ day: 1 }).endOf('day').toISO(),
    }

    // fetch upcoming and default past appointments ranges
    dispatch(prefetchAppointments(upcomingRange, pastRange, ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID))
  }, [dispatch])

  if (useError(ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID)) {
    return <ErrorComponent />
  }

  const serviceErrorAlert = (): ReactElement => {
    const pastAppointmentError = selectedTab === t('appointmentsTab.past') && (pastVaServiceError || pastCcServiceError)
    const upcomingAppointmentError = selectedTab === t('appointmentsTab.upcoming') && (upcomingVaServiceError || upcomingCcServiceError)
    if (pastAppointmentError || upcomingAppointmentError) {
      return (
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
          <AlertBox
            title={t('appointments.appointmentsStatusSomeUnavailable')}
            text={t('appointments.troubleLoadingSomeAppointments')}
            border="error"
            background="noCardBackground"
            titleA11yLabel={t('appointments.appointmentsStatusSomeUnavailable.a11yLabel')}
            textA11yLabel={t('appointments.troubleLoadingSomeAppointments.a11yLabel')}
          />
        </Box>
      )
    }

    return <></>
  }

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
  }

  return (
    <ScrollView {...testIdProps('Appointments-page')} contentContainerStyle={scrollStyles}>
      <Box flex={1} justifyContent="flex-start">
        <Box mb={theme.dimensions.marginBetween} mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
          <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} accessibilityHints={a11yHints} />
        </Box>
        {serviceErrorAlert()}
        <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
          {selectedTab === t('appointmentsTab.past') && <PastAppointments />}
          {selectedTab === t('appointmentsTab.upcoming') && <UpcomingAppointments />}
        </Box>
      </Box>
    </ScrollView>
  )
}

type AppointmentStackScreenProps = Record<string, unknown>

const AppointmentScreenStack = createStackNavigator()

/**
 * Stack screen for the Appointments tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const AppointmentStackScreen: FC<AppointmentStackScreenProps> = () => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const headerStyles = useHeaderStyles()

  return (
    <AppointmentScreenStack.Navigator screenOptions={headerStyles}>
      <AppointmentScreenStack.Screen name="Appointment" component={AppointmentsScreen} options={{ title: t('title') }} />
    </AppointmentScreenStack.Navigator>
  )
}

export default AppointmentStackScreen
