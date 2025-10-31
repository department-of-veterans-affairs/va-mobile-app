import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { SegmentedControl, useIsScreenReaderEnabled } from '@department-of-veterans-affairs/mobile-component-library'

import { useAppointments } from 'api/appointments'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { AppointmentsErrorServiceTypesConstants } from 'api/types'
import { AlertWithHaptics, Box, ErrorComponent, FeatureLandingTemplate } from 'components'
import FloatingButton from 'components/FloatingButton'
import { VAScrollViewProps } from 'components/VAScrollView'
import { Events } from 'constants/analytics'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { NAMESPACE } from 'constants/namespaces'
import NoMatchInRecords from 'screens/HealthScreen/Appointments/NoMatchInRecords/NoMatchInRecords'
import PastAppointments from 'screens/HealthScreen/Appointments/PastAppointments/PastAppointments'
import PastAppointmentsOld from 'screens/HealthScreen/Appointments/PastAppointments/PastAppointmentsOld'
import UpcomingAppointments from 'screens/HealthScreen/Appointments/UpcomingAppointments/UpcomingAppointments'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { getPastAppointmentDateRange, getUpcomingAppointmentDateRange } from 'utils/appointments'
import getEnv from 'utils/env'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'

const { LINK_URL_SCHEDULE_APPOINTMENTS } = getEnv()

type AppointmentsScreenProps = StackScreenProps<HealthStackParamList, 'Appointments'>

function Appointments({ navigation, route }: AppointmentsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const controlLabels = [t('appointmentsTab.upcoming'), t('appointmentsTab.past')]
  const a11yHints = [t('appointmentsTab.upcoming.a11yHint'), t('appointmentsTab.past.a11yHint')]
  const controlIDs = ['apptsUpcomingID', 'apptsPastID']
  const initialTab = route?.params?.tab
  const [selectedTab, setSelectedTab] = useState(initialTab ? initialTab : 0)
  const [dateRange, setDateRange] = useState(
    initialTab ? getPastAppointmentDateRange() : getUpcomingAppointmentDateRange(),
  )
  const [timeFrame, setTimeFrame] = useState(
    initialTab ? TimeFrameTypeConstants.PAST_THREE_MONTHS : TimeFrameTypeConstants.UPCOMING,
  )
  const [page, setPage] = useState(1)
  const screenReaderEnabled = useIsScreenReaderEnabled()

  const {
    data: userAuthorizedServices,
    error: getUserAuthorizedServicesError,
    isFetching: fetchingAuthServices,
    refetch: refetchUserAuthorizedServices,
  } = useAuthorizedServices()
  const apptsNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.appointments)
  const {
    data: apptsData,
    error: appointmentsHasError,
    isFetching: loadingAppointments,
    refetch: refetchAppts,
  } = useAppointments(dateRange.startDate, dateRange.endDate, timeFrame, {
    enabled: screenContentAllowed('WG_Appointments'),
  })
  // Resets scroll position to top whenever current page appointment list changes:
  // Previously IOS left position at the bottom, which is where the user last tapped to navigate to next/prev page.
  // Position reset is necessary to make the pagination component padding look consistent between pages,
  // since the appointment list sizes differ depending on content
  const scrollViewRef = useRef<ScrollView | null>(null)

  const onTabChange = (tab: number) => {
    if (selectedTab !== tab) {
      if (tab === 0) {
        setDateRange(getUpcomingAppointmentDateRange())
        setTimeFrame(TimeFrameTypeConstants.UPCOMING)
      } else {
        setDateRange(getPastAppointmentDateRange())
        setTimeFrame(TimeFrameTypeConstants.PAST_THREE_MONTHS)
      }
      setPage(1)
    }
    setSelectedTab(tab)
  }

  function serviceErrorAlert() {
    const appointmentsMetaErrors = apptsData?.meta?.errors
    const serviceError = !!appointmentsMetaErrors?.find((error) => {
      return (
        error.source === AppointmentsErrorServiceTypesConstants.VA ||
        error.source === AppointmentsErrorServiceTypesConstants.COMMUNITY_CARE
      )
    })
    if (serviceError) {
      return (
        <Box mb={theme.dimensions.condensedMarginBetween}>
          <AlertWithHaptics
            variant="error"
            header={t('appointments.appointmentsStatusSomeUnavailable')}
            headerA11yLabel={a11yLabelVA(t('appointments.appointmentsStatusSomeUnavailable'))}
            description={t('appointments.troubleLoadingSomeAppointments')}
            descriptionA11yLabel={a11yLabelVA(t('appointments.troubleLoadingSomeAppointments'))}
            scrollViewRef={scrollViewRef}
          />
        </Box>
      )
    }

    return <></>
  }

  const scrollViewProps: VAScrollViewProps = {
    scrollViewRef: scrollViewRef,
  }

  const getStartSchedulingButton = () => {
    // Hide the start scheduling button during loading and error states
    const hideStartSchedulingButton =
      !apptsNotInDowntime ||
      !!getUserAuthorizedServicesError ||
      fetchingAuthServices ||
      !userAuthorizedServices?.appointments ||
      !!appointmentsHasError ||
      loadingAppointments

    return (
      <FloatingButton
        isHidden={hideStartSchedulingButton}
        testID="startSchedulingTestID"
        label={t('appointments.startScheduling')}
        onPress={() => {
          logAnalyticsEvent(Events.vama_webview('StartScheduling: ' + LINK_URL_SCHEDULE_APPOINTMENTS))
          navigateTo('Webview', {
            url: LINK_URL_SCHEDULE_APPOINTMENTS,
            displayTitle: t('webview.vagov'),
            loadingMessage: t('webview.appointments.loading'),
            useSSO: true,
          })
        }}
      />
    )
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('appointments')}
      scrollViewProps={scrollViewProps}
      testID="appointmentsTestID"
      footerContent={screenReaderEnabled || !featureEnabled('startScheduling') ? undefined : getStartSchedulingButton()}
      backLabelTestID="appointmentsBackTestID">
      {!apptsNotInDowntime ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID} />
      ) : getUserAuthorizedServicesError && !fetchingAuthServices ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID}
          onTryAgain={refetchUserAuthorizedServices}
          error={getUserAuthorizedServicesError}
        />
      ) : !userAuthorizedServices?.appointments ? (
        <NoMatchInRecords />
      ) : appointmentsHasError && !loadingAppointments ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID}
          onTryAgain={refetchAppts}
          error={appointmentsHasError}
        />
      ) : (
        <Box>
          {featureEnabled('startScheduling') && screenReaderEnabled ? getStartSchedulingButton() : undefined}
          <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
            <SegmentedControl
              labels={controlLabels}
              onChange={onTabChange}
              selected={selectedTab}
              a11yHints={a11yHints}
              testIDs={controlIDs}
            />
          </Box>
          {serviceErrorAlert()}
          <Box mb={theme.dimensions.floatingButtonOffset}>
            {selectedTab === 1 &&
              (featureEnabled('datePickerUpdate') ? (
                <PastAppointments
                  appointmentsData={apptsData}
                  dateRange={dateRange}
                  loading={loadingAppointments || fetchingAuthServices}
                  setDateRange={setDateRange}
                  setTimeFrame={setTimeFrame}
                  scrollViewRef={scrollViewRef}
                />
              ) : (
                <PastAppointmentsOld
                  appointmentsData={apptsData}
                  page={page}
                  setPage={setPage}
                  loading={loadingAppointments || fetchingAuthServices}
                  setDateRange={setDateRange}
                  setTimeFrame={setTimeFrame}
                  scrollViewRef={scrollViewRef}
                />
              ))}
            {selectedTab === 0 && (
              <UpcomingAppointments
                appointmentsData={apptsData}
                page={page}
                setPage={setPage}
                loading={loadingAppointments || fetchingAuthServices}
                scrollViewRef={scrollViewRef}
              />
            )}
          </Box>
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default Appointments
