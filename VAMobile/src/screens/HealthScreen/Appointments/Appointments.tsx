import { DateTime } from 'luxon'
import { ScrollView } from 'react-native'
import { SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'
import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { useEffect, useRef, useState } from 'react'

import { AlertBox, Box, ErrorComponent, FeatureLandingTemplate } from 'components'
import { AppointmentsDateRange } from 'store/slices/appointmentsSlice'
import { AppointmentsState } from 'store/slices'
import { Events } from 'constants/analytics'
import { HealthStackParamList } from '../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types'
import { VAScrollViewProps } from 'components/VAScrollView'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useError, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import CernerAlert from '../CernerAlert'
import NoMatchInRecords from './NoMatchInRecords/NoMatchInRecords'
import PastAppointments from './PastAppointments/PastAppointments'
import UpcomingAppointments from './UpcomingAppointments/UpcomingAppointments'

type AppointmentsScreenProps = StackScreenProps<HealthStackParamList, 'Appointments'>

export const getUpcomingAppointmentDateRange = (): AppointmentsDateRange => {
  const todaysDate = DateTime.local()
  const futureDate = todaysDate.plus({ days: 390 })

  return {
    startDate: todaysDate.startOf('day').toISO(),
    endDate: futureDate.endOf('day').toISO(),
  }
}

function Appointments({ navigation }: AppointmentsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const controlLabels = [t('appointmentsTab.upcoming'), t('appointmentsTab.past')]
  const a11yHints = [t('appointmentsTab.upcoming.a11yHint'), t('appointmentsTab.past.a11yHint')]
  const [selectedTab, setSelectedTab] = useState(0)
  const { upcomingVaServiceError, upcomingCcServiceError, pastVaServiceError, pastCcServiceError, currentPageAppointmentsByYear } = useSelector<RootState, AppointmentsState>(
    (state) => state.appointments,
  )

  const { data: userAuthorizedServices, isError: getUserAuthorizedServicesError } = useAuthorizedServices()

  // Resets scroll position to top whenever current page appointment list changes:
  // Previously IOS left position at the bottom, which is where the user last tapped to navigate to next/prev page.
  // Position reset is necessary to make the pagination component padding look consistent between pages,
  // since the appointment list sizes differ depending on content
  const scrollViewRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
  }, [currentPageAppointmentsByYear])

  if (useError(ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID) || getUserAuthorizedServicesError) {
    return (
      <FeatureLandingTemplate backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('appointments')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (!userAuthorizedServices?.appointments) {
    return (
      <FeatureLandingTemplate backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('appointments')}>
        <NoMatchInRecords />
      </FeatureLandingTemplate>
    )
  }

  const onTabChange = (tab: number) => {
    if (selectedTab !== tab) {
      logAnalyticsEvent(Events.vama_segcontrol_click(controlLabels[tab]))
    }
    setSelectedTab(tab)
  }

  function serviceErrorAlert() {
    const pastAppointmentError = selectedTab === 1 && (pastVaServiceError || pastCcServiceError)
    const upcomingAppointmentError = selectedTab === 0 && (upcomingVaServiceError || upcomingCcServiceError)
    if (pastAppointmentError || upcomingAppointmentError) {
      return (
        <Box mb={theme.dimensions.standardMarginBetween}>
          <AlertBox
            scrollViewRef={scrollViewRef}
            title={t('appointments.appointmentsStatusSomeUnavailable')}
            text={t('appointments.troubleLoadingSomeAppointments')}
            border="error"
            titleA11yLabel={a11yLabelVA(t('appointments.appointmentsStatusSomeUnavailable'))}
            textA11yLabel={a11yLabelVA(t('appointments.troubleLoadingSomeAppointments'))}
          />
        </Box>
      )
    }

    return <></>
  }

  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('appointments')}
      scrollViewProps={scrollViewProps}
      testID="appointmentsTestID">
      <Box flex={1} justifyContent="flex-start">
        <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
          <SegmentedControl labels={controlLabels} onChange={onTabChange} selected={selectedTab} a11yHints={a11yHints} />
        </Box>
        {serviceErrorAlert()}
        {CernerAlert ? (
          <Box mb={theme.dimensions.contentMarginBottom}>
            <CernerAlert />
          </Box>
        ) : (
          <></>
        )}
        <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
          {selectedTab === 1 && <PastAppointments />}
          {selectedTab === 0 && <UpcomingAppointments />}
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default Appointments
