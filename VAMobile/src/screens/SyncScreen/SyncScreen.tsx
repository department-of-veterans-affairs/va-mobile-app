import { ViewStyle } from 'react-native'
import React, { FC, useEffect, useState } from 'react'

import { Box, TextView, VAIcon, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { checkForDowntimeErrors } from 'store/slices/errorSlice'
import { completeSync, logInDemoMode } from 'store/slices/authSlice'
import { getDisabilityRating } from 'store/slices/disabilityRatingSlice'
import { getProfileInfo } from 'store/slices/personalInformationSlice'
import { getServiceHistory } from 'store/slices/militaryServiceSlice'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useAppSelector, useTheme, useTranslation } from 'utils/hooks'

export type SyncScreenProps = Record<string, unknown>
const SyncScreen: FC<SyncScreenProps> = () => {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.splashScreen,
  }
  const dispatch = useAppDispatch()
  const t = useTranslation(NAMESPACE.LOGIN)

  const { loggedIn, loggingOut, syncing } = useAppSelector((state) => state.auth)
  const { demoMode } = useAppSelector((state) => state.demo)
  const { preloadComplete: personalInformationLoaded } = useAppSelector((s) => s.personalInformation)
  const { preloadComplete: militaryHistoryLoaded } = useAppSelector((s) => s.militaryService)
  const { preloadComplete: disabilityRatingLoaded } = useAppSelector((s) => s.disabilityRating)
  const { hasLoaded: authorizedServicesLoaded, militaryServiceHistory: militaryInfoAuthorization } = useAppSelector((state) => state.authorizedServices)

  const [displayMessage, setDisplayMessage] = useState()

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
      if (!personalInformationLoaded) {
        dispatch(getProfileInfo())
      } else if (authorizedServicesLoaded && militaryInfoAuthorization && !militaryHistoryLoaded) {
        dispatch(getServiceHistory())
      } else if (!disabilityRatingLoaded) {
        dispatch(getDisabilityRating())
      }
    }
  }, [dispatch, loggedIn, personalInformationLoaded, militaryInfoAuthorization, authorizedServicesLoaded, disabilityRatingLoaded, militaryHistoryLoaded])

  useEffect(() => {
    if (syncing) {
      if (!loggedIn) {
        setDisplayMessage(t('sync.progress.signin'))
      } else if (loggingOut) {
        setDisplayMessage(t('sync.progress.signout'))
      } else if (!personalInformationLoaded) {
        setDisplayMessage(t('sync.progress.personalInfo'))
      } else if (!militaryHistoryLoaded) {
        setDisplayMessage(t('sync.progress.military'))
      } else if (!disabilityRatingLoaded) {
        setDisplayMessage(t('sync.progress.disabilityRating'))
      }
    } else {
      setDisplayMessage(t(''))
    }

    const finishSyncingMilitaryHistory = authorizedServicesLoaded && (!militaryInfoAuthorization || militaryHistoryLoaded)
    if (personalInformationLoaded && finishSyncingMilitaryHistory && loggedIn && !loggingOut && disabilityRatingLoaded) {
      dispatch(completeSync())
    }
  }, [dispatch, loggedIn, loggingOut, authorizedServicesLoaded, personalInformationLoaded, militaryHistoryLoaded, militaryInfoAuthorization, t, disabilityRatingLoaded, syncing])

  return (
    <VAScrollView {...testIdProps('Sync-page')} contentContainerStyle={splashStyles}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
        <VAIcon name={'Logo'} />
        <Box flexDirection={'row'} alignItems={'center'} justifyContent={'center'} mx={theme.dimensions.gutter} mt={theme.dimensions.syncLogoSpacing}>
          <TextView justifyContent={'center'} color={'primaryContrast'} alignItems={'center'} textAlign={'center'}>
            {displayMessage}
          </TextView>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default SyncScreen
