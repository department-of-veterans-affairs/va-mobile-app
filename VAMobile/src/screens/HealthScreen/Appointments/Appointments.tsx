import { DateTime } from 'luxon'
import { StackScreenProps } from '@react-navigation/stack'
import { ViewStyle } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect, useState } from 'react'

import { AppointmentsDateRange, prefetchAppointments } from 'store/actions'

import { AlertBox, Box, ErrorComponent, SegmentedControl, VAScrollView } from 'components'
import { AppointmentsState, AuthorizedServicesState, StoreState } from 'store/reducers'
import { HealthStackParamList } from '../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'
import NoMatchInRecords from './NoMatchInRecords/NoMatchInRecords'
import PastAppointments from './PastAppointments/PastAppointments'
import UpcomingAppointments from './UpcomingAppointments/UpcomingAppointments'

type AppointmentsScreenProps = StackScreenProps<HealthStackParamList, 'Appointments'>

export const getUpcomingAppointmentDateRange = (): AppointmentsDateRange => {
  const todaysDate = DateTime.local()
  const twelveMonthsFromToday = todaysDate.plus({ months: 12 })

  return {
    startDate: todaysDate.startOf('day').toISO(),
    endDate: twelveMonthsFromToday.endOf('day').toISO(),
  }
}

const Appointments: FC<AppointmentsScreenProps> = ({}) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useDispatch()
  const controlValues = [t('appointmentsTab.upcoming'), t('appointmentsTab.past')]
  const a11yHints = [t('appointmentsTab.upcoming.a11yHint'), t('appointmentsTab.past.a11yHint')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])
  const { upcomingVaServiceError, upcomingCcServiceError, pastVaServiceError, pastCcServiceError } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)
  const { appointments } = useSelector<StoreState, AuthorizedServicesState>((state) => state.authorizedServices)

  useEffect(() => {
    const todaysDate = DateTime.local()
    const threeMonthsEarlier = todaysDate.minus({ months: 3 })

    const upcomingRange: AppointmentsDateRange = getUpcomingAppointmentDateRange()
    const pastRange: AppointmentsDateRange = {
      startDate: threeMonthsEarlier.startOf('day').toISO(),
      endDate: todaysDate.minus({ day: 1 }).endOf('day').toISO(),
    }

    // fetch upcoming and default past appointments ranges
    dispatch(prefetchAppointments(upcomingRange, pastRange, ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID))
  }, [dispatch])

  if (useError(ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID} />
  }

  // TODO: revisit when this is displayed when the health tab is created (currently in authorized
  //  services list there is only appointments)
  if (!appointments) {
    return <NoMatchInRecords />
  }

  const serviceErrorAlert = (): ReactElement => {
    const pastAppointmentError = selectedTab === t('appointmentsTab.past') && (pastVaServiceError || pastCcServiceError)
    const upcomingAppointmentError = selectedTab === t('appointmentsTab.upcoming') && (upcomingVaServiceError || upcomingCcServiceError)
    if (pastAppointmentError || upcomingAppointmentError) {
      return (
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
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
    <VAScrollView {...testIdProps('Appointments-page')} contentContainerStyle={scrollStyles}>
      <Box flex={1} justifyContent="flex-start">
        <Box mb={theme.dimensions.standardMarginBetween} mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
          <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} accessibilityHints={a11yHints} />
        </Box>
        {serviceErrorAlert()}
        <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
          {selectedTab === t('appointmentsTab.past') && <PastAppointments />}
          {selectedTab === t('appointmentsTab.upcoming') && <UpcomingAppointments />}
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default Appointments
