import { ViewStyle } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { AuthState, AuthorizedServicesState, DemoState, DisabilityRatingState, MilitaryServiceState, PersonalInformationState, StoreState } from 'store/reducers'
import { Box, TextView, VAIcon, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { checkForDowntimeErrors } from 'store/actions'
import { completeSync, getDisabilityRating, getProfileInfo, getServiceHistory, logInDemoMode } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

export type SyncScreenProps = Record<string, unknown>
const SyncScreen: FC<SyncScreenProps> = () => {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.splashScreen,
  }
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.LOGIN)

  const { loggedIn, loggingOut, syncing } = useSelector<StoreState, AuthState>((state) => state.auth)
  const { demoMode } = useSelector<StoreState, DemoState>((state) => state.demo)
  const { preloadComplete: personalInformationLoaded } = useSelector<StoreState, PersonalInformationState>((s) => s.personalInformation)
  const { preloadComplete: militaryHistoryLoaded } = useSelector<StoreState, MilitaryServiceState>((s) => s.militaryService)
  const { preloadComplete: disabilityRatingLoaded } = useSelector<StoreState, DisabilityRatingState>((s) => s.disabilityRating)
  const { hasLoaded: authorizedServicesLoaded, militaryServiceHistory: militaryInfoAuthorization } = useSelector<StoreState, AuthorizedServicesState>((s) => s.authorizedServices)

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
