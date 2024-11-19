import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StatusBar, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'

import { colors as DSColors } from '@department-of-veterans-affairs/mobile-tokens'

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
import { AuthState, ErrorsState, checkForDowntimeErrors, completeSync, logInDemoMode } from 'store/slices'
import { DemoState } from 'store/slices/demoSlice'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { getUpcomingAppointmentDateRange } from 'utils/appointments'
import getEnv from 'utils/env'
import { useAppDispatch, useOrientation, useTheme } from 'utils/hooks'

export type SyncScreenProps = Record<string, unknown>
function SyncScreen({}: SyncScreenProps) {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.loginScreen,
  }
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isPortrait = useOrientation()

  const { ENVIRONMENT } = getEnv()

  const { loggedIn, loggingOut, syncing } = useSelector<RootState, AuthState>((state) => state.auth)
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
      dispatch(logInDemoMode())
    }
  }, [dispatch, demoMode, loggedIn])

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

    if (!loggingOut && loggedIn && downtimeWindowsFetched && authorizedServicesFetched) {
      setAnalyticsUserProperty(UserAnalytics.vama_environment(ENVIRONMENT))
      dispatch(completeSync())
    }
  }, [dispatch, loggedIn, loggingOut, downtimeWindowsFetched, authorizedServicesFetched, t, syncing, ENVIRONMENT])

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
            spinnerColor={theme.mode === 'dark' ? DSColors.vadsColorBaseLightest : DSColors.vadsColorPrimary}
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
