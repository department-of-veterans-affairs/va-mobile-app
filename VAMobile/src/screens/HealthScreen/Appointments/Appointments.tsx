import { DateTime } from 'luxon'
import { ScrollView, ViewStyle } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, ReactNode, useEffect, useRef, useState } from 'react'

import { AlertBox, Box, ErrorComponent, FeatureLandingTemplate, FooterButton, SegmentedControl } from 'components' // , VAScrollView
import { AppointmentsDateRange, prefetchAppointments } from 'store/slices/appointmentsSlice'
import { AppointmentsState, AuthorizedServicesState } from 'store/slices'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { HealthStackParamList } from '../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { featureEnabled } from 'utils/remoteConfig'
// import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDowntime, useError, useHasCernerFacilities, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import CernerAlert from '../CernerAlert'
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
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const dispatch = useAppDispatch()
  const controlValues = [t('appointmentsTab.upcoming'), t('appointmentsTab.past')]
  const a11yHints = [t('appointmentsTab.upcoming.a11yHint'), t('appointmentsTab.past.a11yHint')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])
  const { upcomingVaServiceError, upcomingCcServiceError, pastVaServiceError, pastCcServiceError, currentPageAppointmentsByYear } = useSelector<RootState, AppointmentsState>(
    (state) => state.appointments,
  )
  const { appointments, scheduleAppointments } = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)
  const hasCernerFacilities = useHasCernerFacilities()
  const apptsNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.appointments)
  const navigateToRequestAppointments = navigateTo('RequestAppointmentScreen')
  const navigateToNoRequestAppointmentAccess = navigateTo('NoRequestAppointmentAccess')

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
    if (apptsNotInDowntime) {
      dispatch(prefetchAppointments(upcomingRange, pastRange, ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID))
    }
  }, [dispatch, apptsNotInDowntime])

  if (useError(ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID} />
  }

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

  const onRequestAppointmentPress = () => {
    scheduleAppointments ? navigateToRequestAppointments() : navigateToNoRequestAppointmentAccess()
  }

  const appointmentsContent: ReactNode = (
    <Box flex={1} justifyContent="flex-start">
      <Box mb={theme.dimensions.standardMarginBetween} mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
        <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} accessibilityHints={a11yHints} />
      </Box>
      {serviceErrorAlert()}
      <Box mb={hasCernerFacilities ? theme.dimensions.standardMarginBetween : 0}>
        <CernerAlert />
      </Box>
      <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
        {selectedTab === t('appointmentsTab.past') && <PastAppointments />}
        {selectedTab === t('appointmentsTab.upcoming') && <UpcomingAppointments />}
      </Box>
    </Box>
  )

  // TODO: REVERT FILE BEFORE COMMITTING TO DEVELOP
  return (
    <>
      <FeatureLandingTemplate
        backLabel="Health Care"
        backLabelOnPress={navigateTo('HealthTab')}
        title="Appointments"
        scrollViewProps={{ style: scrollStyles }}
        content={appointmentsContent}
        headerButton={{ label: 'Title', icon: { name: 'ProfileSelected' }, onPress: () => {} }}
        footerContent={featureEnabled('appointmentRequests') && <FooterButton onPress={onRequestAppointmentPress} text={t('requestAppointments.launchModalBtnTitle')} />}>
        {/* <VAScrollView scrollViewRef={scrollViewRef} {...testIdProps('Appointments-page')} contentContainerStyle={scrollStyles}> */}
        {/* </VAScrollView> */}
      </FeatureLandingTemplate>
    </>
  )
}

export default Appointments
