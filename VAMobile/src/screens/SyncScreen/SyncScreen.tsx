import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'

import { useQueryClient } from '@tanstack/react-query'

import { useAuthSettings } from 'api/auth'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useDisabilityRating } from 'api/disabilityRating'
import { useServiceHistory } from 'api/militaryService'
import { Box, LoadingComponent, TextView, VAIcon, VAScrollView } from 'components'
import { UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { checkForDowntimeErrors } from 'store/slices'
import { DemoState } from 'store/slices/demoSlice'
import colors from 'styles/themes/VAColors'
import { testIdProps } from 'utils/accessibility'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { completeSync, loginFinish } from 'utils/auth'
import getEnv from 'utils/env'
import { useAppDispatch, useDowntime, useOrientation, useTheme } from 'utils/hooks'

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
  const queryClient = useQueryClient()
  const { data: userAuthSettings } = useAuthSettings()
  const loggedIn = userAuthSettings?.loggedIn
  const loggingOut = userAuthSettings?.loggingOut
  const syncing = userAuthSettings?.syncing

  const { ENVIRONMENT } = getEnv()

  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const { data: userAuthorizedServices, isLoading: loadingUserAuthorizedServices } = useAuthorizedServices({
    enabled: loggedIn,
  })
  // TODO: For some reason Unit Tests cannot pick up the DowntimeFeatureTypeConstants constant
  const drNotInDowntime = !useDowntime('disability_rating')
  const mhNotInDowntime = !useDowntime('military_service_history')
  const { isFetched: useServiceHistoryFetched } = useServiceHistory({
    enabled: userAuthorizedServices?.militaryServiceHistory && mhNotInDowntime && loggedIn,
  })
  const { isFetched: useDisabilityRatingFetched } = useDisabilityRating({
    enabled: userAuthorizedServices?.disabilityRating && drNotInDowntime && loggedIn,
  })
  const [displayMessage, setDisplayMessage] = useState('')

  useEffect(() => {
    dispatch(checkForDowntimeErrors())
  }, [dispatch])

  useEffect(() => {
    if (demoMode && !loggedIn) {
      loginFinish(false, queryClient)
    }
  }, [dispatch, demoMode, loggedIn, queryClient])

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

    const finishSyncingMilitaryHistory =
      !mhNotInDowntime ||
      (!loadingUserAuthorizedServices && (!userAuthorizedServices?.militaryServiceHistory || useServiceHistoryFetched))
    const finishSyncingDisabilityRating =
      !drNotInDowntime ||
      (!loadingUserAuthorizedServices && (!userAuthorizedServices?.disabilityRating || useDisabilityRatingFetched))
    if (finishSyncingMilitaryHistory && loggedIn && !loggingOut && finishSyncingDisabilityRating) {
      completeSync(queryClient)
      setAnalyticsUserProperty(UserAnalytics.vama_environment(ENVIRONMENT))
    }
  }, [
    dispatch,
    loggedIn,
    loggingOut,
    loadingUserAuthorizedServices,
    useServiceHistoryFetched,
    userAuthorizedServices,
    t,
    useDisabilityRatingFetched,
    drNotInDowntime,
    mhNotInDowntime,
    syncing,
    queryClient,
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
