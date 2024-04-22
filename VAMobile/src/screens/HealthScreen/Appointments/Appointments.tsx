import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack'

import { SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { AlertBox, Box, ErrorComponent, FeatureLandingTemplate } from 'components'
import { VAScrollViewProps } from 'components/VAScrollView'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { AppointmentsState } from 'store/slices'
import { AppointmentsDateRange, prefetchAppointments } from 'store/slices/appointmentsSlice'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, useDowntime, useError, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import CernerAlert from '../CernerAlert'
import { HealthStackParamList } from '../HealthStackScreens'
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
  const dispatch = useAppDispatch()
  const controlLabels = [t('appointmentsTab.upcoming'), t('appointmentsTab.past')]
  const a11yHints = [t('appointmentsTab.upcoming.a11yHint'), t('appointmentsTab.past.a11yHint')]
  const [selectedTab, setSelectedTab] = useState(0)
  const {
    upcomingVaServiceError,
    upcomingCcServiceError,
    pastVaServiceError,
    pastCcServiceError,
    currentPageAppointmentsByYear,
  } = useSelector<RootState, AppointmentsState>((state) => state.appointments)

  const { data: userAuthorizedServices, isError: getUserAuthorizedServicesError } = useAuthorizedServices()
  const apptsNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.appointments)

  // Resets scroll position to top whenever current page appointment list changes:
  // Previously IOS left position at the bottom, which is where the user last tapped to navigate to next/prev page.
  // Position reset is necessary to make the pagination component padding look consistent between pages,
  // since the appointment list sizes differ depending on content
  const scrollViewRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
  }, [currentPageAppointmentsByYear])

  useEffect(() => {
    const todaysDate = DateTime.local()
    const threeMonthsEarlier = todaysDate.minus({ months: 3 })

    const upcomingRange: AppointmentsDateRange = getUpcomingAppointmentDateRange()
    const pastRange: AppointmentsDateRange = {
      startDate: threeMonthsEarlier.startOf('day').toISO(),
      endDate: todaysDate.minus({ days: 1 }).endOf('day').toISO(),
    }

    // fetch upcoming and default past appointments ranges
    if (screenContentAllowed('WG_Appointments') && apptsNotInDowntime) {
      dispatch(prefetchAppointments(upcomingRange, pastRange, ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID))
    }
  }, [dispatch, apptsNotInDowntime])

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

  const hasError = useError(ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID) || getUserAuthorizedServicesError

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('appointments')}
      scrollViewProps={scrollViewProps}
      testID="appointmentsTestID">
      {hasError ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID} />
      ) : !userAuthorizedServices?.appointments ? (
        <NoMatchInRecords />
      ) : (
        <Box flex={1} justifyContent="flex-start">
          <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
            <SegmentedControl
              labels={controlLabels}
              onChange={onTabChange}
              selected={selectedTab}
              a11yHints={a11yHints}
            />
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
      )}
    </FeatureLandingTemplate>
  )
}

export default Appointments
