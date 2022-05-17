import { ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { AuthState, AuthorizedServicesState, completeSync, logInDemoMode } from 'store/slices'
import { Box, TextView, VAIcon, VAScrollView } from 'components'
import { DemoState } from 'store/slices/demoSlice'
import { DisabilityRatingState, MilitaryServiceState, PersonalInformationState, checkForDowntimeErrors, getDisabilityRating, getProfileInfo, getServiceHistory } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useTheme } from 'utils/hooks'

export type SyncScreenProps = Record<string, unknown>
const SyncScreen: FC<SyncScreenProps> = () => {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.splashScreen,
  }
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.LOGIN)

  const { loggedIn, loggingOut, syncing } = useSelector<RootState, AuthState>((state) => state.auth)
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const { preloadComplete: personalInformationLoaded } = useSelector<RootState, PersonalInformationState>((s) => s.personalInformation)
  const { preloadComplete: militaryHistoryLoaded } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const { preloadComplete: disabilityRatingLoaded } = useSelector<RootState, DisabilityRatingState>((s) => s.disabilityRating)
  const { hasLoaded: authorizedServicesLoaded, militaryServiceHistory: militaryInfoAuthorization } = useSelector<RootState, AuthorizedServicesState>(
    (state) => state.authorizedServices,
  )

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
      if (!loggingOut) {
        setDisplayMessage(t('sync.progress.signin'))
      } else {
        setDisplayMessage(t('sync.progress.signout'))
      }
    } else {
      setDisplayMessage('')
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
        <Box flexDirection={'row'} alignItems={'center'} justifyContent={'center'} mx={theme.dimensions.gutter} mt={50}>
          <TextView variant={'MobileBody'} justifyContent={'center'} color={'primaryContrast'} alignItems={'center'} textAlign={'center'}>
            {displayMessage}
          </TextView>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default SyncScreen
