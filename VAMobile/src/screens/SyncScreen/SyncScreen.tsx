import { ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { AppointmentsState, AuthState, PrescriptionState, completeSync, loadAllPrescriptions, logInDemoMode, prefetchAppointments } from 'store/slices'
import { Box, LoadingComponent, TextView, VAIcon, VAScrollView } from 'components'
import { DemoState } from 'store/slices/demoSlice'
import { DisabilityRatingState, MilitaryServiceState, checkForDowntimeErrors, getDisabilityRating, getServiceHistory } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { getUpcomingAppointmentDateRange } from 'screens/HealthScreen/Appointments/Appointments'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useOrientation, useTheme } from 'utils/hooks'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import colors from 'styles/themes/VAColors'

export type SyncScreenProps = Record<string, unknown>
const SyncScreen: FC<SyncScreenProps> = () => {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.splashScreen,
  }
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isPortrait = useOrientation()

  const { loggedIn, loggingOut, syncing } = useSelector<RootState, AuthState>((state) => state.auth)
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const { preloadComplete: militaryHistoryLoaded, loading: militaryHistoryLoading } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const { preloadComplete: disabilityRatingLoaded, loading: disabilityRatingLoading } = useSelector<RootState, DisabilityRatingState>((s) => s.disabilityRating)
  const { preloadComplete: appointmentsLoaded } = useSelector<RootState, AppointmentsState>((state) => state.appointments)
  const { prescriptionsNeedLoad } = useSelector<RootState, PrescriptionState>((state) => state.prescriptions)
  const { data: userAuthorizedServices, isLoading: loadingUserAuthorizedServices } = useAuthorizedServices({ enabled: loggedIn })

  const [displayMessage, setDisplayMessage] = useState('')

  useEffect(() => {
    dispatch(checkForDowntimeErrors())
  }, [dispatch])

  useEffect(() => {
    if (demoMode && !loggedIn) {
      dispatch(logInDemoMode())
    }
  }, [dispatch, demoMode, loggedIn])

  useEffect(() => {
    if (loggedIn) {
      if (!loadingUserAuthorizedServices && userAuthorizedServices?.militaryServiceHistory && !militaryHistoryLoaded && !militaryHistoryLoading) {
        dispatch(getServiceHistory())
      } else if (!disabilityRatingLoaded && !disabilityRatingLoading) {
        dispatch(getDisabilityRating())
      }
    }
  }, [
    dispatch,
    loggedIn,
    loadingUserAuthorizedServices,
    userAuthorizedServices?.militaryServiceHistory,
    disabilityRatingLoaded,
    disabilityRatingLoading,
    militaryHistoryLoaded,
    militaryHistoryLoading,
  ])

  useEffect(() => {
    if (loggedIn && !appointmentsLoaded) {
      dispatch(prefetchAppointments(getUpcomingAppointmentDateRange()))
    }
  }, [dispatch, loggedIn, appointmentsLoaded])

  useEffect(() => {
    if (loggedIn && prescriptionsNeedLoad) {
      dispatch(loadAllPrescriptions())
    }
  }, [dispatch, loggedIn, prescriptionsNeedLoad])

  useEffect(() => {
    if (syncing) {
      if (!loggingOut) {
        setDisplayMessage(t('sync.progress.signin'))
      } else {
        setDisplayMessage(t('sync.progress.signout'))
      }
    } else {
      setDisplayMessage('')
    }

    const finishSyncingMilitaryHistory = !loadingUserAuthorizedServices && (!userAuthorizedServices?.militaryServiceHistory || militaryHistoryLoaded)
    if (finishSyncingMilitaryHistory && loggedIn && !loggingOut && disabilityRatingLoaded && appointmentsLoaded && !prescriptionsNeedLoad) {
      dispatch(completeSync())
    }
  }, [
    dispatch,
    loggedIn,
    loggingOut,
    loadingUserAuthorizedServices,
    militaryHistoryLoaded,
    userAuthorizedServices?.militaryServiceHistory,
    t,
    disabilityRatingLoaded,
    appointmentsLoaded,
    prescriptionsNeedLoad,
    syncing,
  ])

  return (
    <VAScrollView {...testIdProps('Sync-page')} contentContainerStyle={splashStyles} removeInsets={true}>
      <Box
        justifyContent="center"
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.contentMarginBottom}
        alignItems={'center'}>
        <VAIcon name={'Logo'} />

        <Box alignItems={'center'} justifyContent={'center'} mx={theme.dimensions.gutter} mt={50}>
          <LoadingComponent justTheSpinnerIcon={true} spinnerColor={colors.grayLightest} />
          <TextView
            variant={'MobileBody'}
            justifyContent={'center'}
            color={'primaryContrast'}
            alignItems={'center'}
            textAlign={'center'}
            mt={theme.dimensions.standardMarginBetween}>
            {displayMessage}
          </TextView>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default SyncScreen
