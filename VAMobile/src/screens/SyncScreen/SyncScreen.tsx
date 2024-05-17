import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useDisabilityRating } from 'api/disabilityRating'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { ServiceHistoryData } from 'api/types'
import { Box, LoadingComponent, TextView, VAIcon, VAScrollView } from 'components'
import { Events, UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { AuthState, ErrorsState, checkForDowntimeErrors, completeSync, logInDemoMode } from 'store/slices'
import { DemoState } from 'store/slices/demoSlice'
import colors from 'styles/themes/VAColors'
import { testIdProps } from 'utils/accessibility'
import { logAnalyticsEvent, logNonFatalErrorToFirebase, setAnalyticsUserProperty } from 'utils/analytics'
import getEnv from 'utils/env'
import { useAppDispatch, useOrientation, useTheme } from 'utils/hooks'

export type SyncScreenProps = Record<string, unknown>
function SyncScreen({}: SyncScreenProps) {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.splashScreen,
  }
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isPortrait = useOrientation()

  const { ENVIRONMENT } = getEnv()

  const { loggedIn, loggingOut, syncing } = useSelector<RootState, AuthState>((state) => state.auth)
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const { downtimeWindowsFetched } = useSelector<RootState, ErrorsState>((state) => state.errors)

  const { isFetching: fetchingUserAuthorizedServices } = useAuthorizedServices({
    enabled: loggedIn,
  })
  const { data: militaryServiceHistoryAttributes, isFetching: fetchingServiceHistory } = useServiceHistory({
    enabled: loggedIn && downtimeWindowsFetched,
  })
  const { isFetching: fetchingDisabilityRating } = useDisabilityRating({
    enabled: loggedIn && downtimeWindowsFetched,
  })
  const { data: personalInfoData } = usePersonalInformation({ enabled: loggedIn })

  const [displayMessage, setDisplayMessage] = useState('')
  const serviceHistory = militaryServiceHistoryAttributes?.serviceHistory || ([] as ServiceHistoryData)

  const SERVICE_INDICATOR_KEY = '@store_service_indicator' + personalInfoData?.id

  const setServiceIndicators = async (serviceIndicators: string): Promise<void> => {
    try {
      serviceHistory.forEach((service) => {
        if (service.honorableServiceIndicator === 'Y') {
          logAnalyticsEvent(Events.vama_vet_status_shown())
        } else if (service.honorableServiceIndicator === 'N') {
          logAnalyticsEvent(Events.vama_vet_status_nStatus())
        } else if (service.honorableServiceIndicator === 'Z') {
          logAnalyticsEvent(Events.vama_vet_status_zStatus(service.characterOfDischarge))
        }
      })
      await AsyncStorage.setItem(SERVICE_INDICATOR_KEY, serviceIndicators)
    } catch (err) {
      logNonFatalErrorToFirebase(err, 'loadOverrides: AsyncStorage error')
    }
  }

  const checkServiceIndicators = async (serviceIndicators: string): Promise<void> => {
    try {
      const asyncServiceIndicators = await AsyncStorage.getItem(SERVICE_INDICATOR_KEY)
      if (asyncServiceIndicators) {
        if (asyncServiceIndicators !== serviceIndicators) {
          setServiceIndicators(serviceIndicators)
        }
      } else {
        setServiceIndicators(serviceIndicators)
      }
    } catch (err) {
      logNonFatalErrorToFirebase(err, 'loadOverrides: AsyncStorage error')
    }
  }

  const serviceIndicators: string = ''
  serviceHistory.forEach((service) => {
    serviceIndicators.concat(service.honorableServiceIndicator)
  })
  checkServiceIndicators(serviceIndicators)

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

    if (
      !loggingOut &&
      loggedIn &&
      downtimeWindowsFetched &&
      !fetchingUserAuthorizedServices &&
      !fetchingServiceHistory &&
      !fetchingDisabilityRating
    ) {
      setAnalyticsUserProperty(UserAnalytics.vama_environment(ENVIRONMENT))
      dispatch(completeSync())
    }
  }, [
    dispatch,
    loggedIn,
    loggingOut,
    downtimeWindowsFetched,
    fetchingUserAuthorizedServices,
    fetchingServiceHistory,
    fetchingDisabilityRating,
    t,
    syncing,
    ENVIRONMENT,
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
