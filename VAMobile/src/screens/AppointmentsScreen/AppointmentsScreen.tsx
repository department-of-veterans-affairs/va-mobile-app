import { DateTime } from 'luxon'
import { ScrollView, ViewStyle } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { AppointmentsDateRange, prefetchAppointments } from 'store/actions'

import { AppointmentsStackParamList } from './AppointmentStackScreens'
import { Box, ErrorComponent, SegmentedControl } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'
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

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
  }

  return (
    <ScrollView contentContainerStyle={scrollStyles}>
      <Box flex={1} justifyContent="flex-start" {...testIdProps('Appointments-screen')}>
        <Box mb={theme.dimensions.marginBetween} mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
          <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} accessibilityHints={a11yHints} />
        </Box>
        <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
          {selectedTab === t('appointmentsTab.past') && <PastAppointments />}
          {selectedTab === t('appointmentsTab.upcoming') && <UpcomingAppointments />}
        </Box>
      </Box>
    </ScrollView>
  )
}

export default AppointmentsScreen
