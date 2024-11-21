import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StatusBar, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'

import { useQueryClient } from '@tanstack/react-query'

import { useAppointments } from 'api/appointments'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useClaimsAndAppeals } from 'api/claimsAndAppeals'
import { useDisabilityRating } from 'api/disabilityRating'
import { useFacilitiesInfo } from 'api/facilities/getFacilitiesInfo'
import { useLetterBeneficiaryData } from 'api/letters'
import { useServiceHistory } from 'api/militaryService'
import { usePrescriptions } from 'api/prescriptions'
import { useFolders } from 'api/secureMessaging'
import { Box, LoadingComponent, TextView, VALogo, VAScrollView } from 'components'
import { UserAnalytics } from 'constants/analytics'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { AuthState, ErrorsState, checkForDowntimeErrors, dispatchUpdateSyncing } from 'store/slices'
import { DemoState } from 'store/slices/demoSlice'
import colors from 'styles/themes/VAColors'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { getUpcomingAppointmentDateRange } from 'utils/appointments'
import { loginFinish } from 'utils/auth'
import getEnv from 'utils/env'
import { useAppDispatch, useOrientation, useShowActionSheet, useTheme } from 'utils/hooks'

export type SyncScreenProps = Record<string, unknown>
function SyncScreen({}: SyncScreenProps) {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.loginScreen,
  }
  const dispatch = useAppDispatch()
  const showActionSheet = useShowActionSheet()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isPortrait = useOrientation()
  const queryClient = useQueryClient()
  const { loggedIn, loggingOut, syncing } = useSelector<RootState, AuthState>((state) => state.auth)

  const { ENVIRONMENT } = getEnv()

  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const { downtimeWindowsFetched } = useSelector<RootState, ErrorsState>((state) => state.errors)
  const { isFetched: authorizedServicesFetched } = useAuthorizedServices()

  // Prefetch data for `Activity` section
  const upcomingAppointmentDateRange = getUpcomingAppointmentDateRange()
  useAppointments(
    upcomingAppointmentDateRange.startDate,
    upcomingAppointmentDateRange.endDate,
    TimeFrameTypeConstants.UPCOMING,
    {
      enabled: !loggingOut && loggedIn && downtimeWindowsFetched,
    },
  )
  useClaimsAndAppeals('ACTIVE', { enabled: !loggingOut && loggedIn && downtimeWindowsFetched })
  useFolders({ enabled: !loggingOut && loggedIn && downtimeWindowsFetched })
  usePrescriptions({ enabled: !loggingOut && loggedIn && downtimeWindowsFetched })
  useFacilitiesInfo({ enabled: !loggingOut && loggedIn })

  // Prefetch data for `About you` section
  useServiceHistory({ enabled: !loggingOut && loggedIn && downtimeWindowsFetched })
  useDisabilityRating({ enabled: !loggingOut && loggedIn && downtimeWindowsFetched })
  useLetterBeneficiaryData({ enabled: !loggingOut && loggedIn && downtimeWindowsFetched })

  const [displayMessage, setDisplayMessage] = useState('')

  useEffect(() => {
    dispatch(checkForDowntimeErrors())
  }, [dispatch])

  useEffect(() => {
    if (demoMode && !loggedIn) {
      loginFinish(dispatch, false)
    }
  }, [dispatch, demoMode, loggedIn, queryClient])

  useEffect(() => {
    const options = ['Close']
    if (syncing) {
      if (!loggingOut) {
        setDisplayMessage(t('sync.progress.signin'))
      } else {
        setDisplayMessage(t('sync.progress.signout'))
      }
    } else {
      setDisplayMessage('')
    }

    if (!loggingOut && loggedIn && downtimeWindowsFetched && authorizedServicesFetched) {
      dispatch(dispatchUpdateSyncing(false))
      showActionSheet(
        {
          title: 'Maybe this is getting called',
          message: `LoggedIN: ${loggedIn}, LoggingOut: ${loggingOut}, Syncing: ${syncing}, sync screen values`,
          options,
          cancelButtonIndex: 0,
        },
        () => {},
      )
      setAnalyticsUserProperty(UserAnalytics.vama_environment(ENVIRONMENT))
    }
  }, [
    loggedIn,
    loggingOut,
    downtimeWindowsFetched,
    authorizedServicesFetched,
    t,
    syncing,
    queryClient,
    ENVIRONMENT,
    dispatch,
  ])

  return (
    <VAScrollView contentContainerStyle={splashStyles} removeInsets={true}>
      <StatusBar
        translucent
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background.main}
      />
      <Box
        justifyContent="center"
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.contentMarginBottom}
        alignItems={'center'}>
        <VALogo />
        <Box alignItems={'center'} justifyContent={'center'} mx={theme.dimensions.gutter} mt={50}>
          <LoadingComponent
            justTheSpinnerIcon={true}
            spinnerColor={theme.mode === 'dark' ? colors.grayLightest : colors.primary}
          />
          <TextView
            variant={'MobileBody'}
            justifyContent={'center'}
            color={'primary'}
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
