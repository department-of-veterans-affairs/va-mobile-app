import { ScrollView, ViewStyle } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import { AuthState, MilitaryServiceState, PersonalInformationState, StoreState } from 'store/reducers'
import { Box, TextView, VAIcon } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { completeSync, getProfileInfo, getServiceHistory } from 'store/actions'
import { useTheme, useTranslation } from 'utils/hooks'

export type SyncScreenProps = {}
const SyncScreen: FC<SyncScreenProps> = () => {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.splashScreen,
  }
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.LOGIN)

  const { loggedIn } = useSelector<StoreState, AuthState>((state) => state.auth)
  const { needsDataLoad: personalInformationNotLoaded } = useSelector<StoreState, PersonalInformationState>((s) => s.personalInformation)
  const { needsDataLoad: militaryHistoryNotLoaded } = useSelector<StoreState, MilitaryServiceState>((s) => s.militaryService)

  const [displayMessage, setDisplayMessage] = useState()

  useEffect(() => {
    if (loggedIn) {
      dispatch(getProfileInfo())
      dispatch(getServiceHistory())
    }
  }, [dispatch, loggedIn])

  useEffect(() => {
    if (personalInformationNotLoaded) {
      setDisplayMessage(t('sync.progress.personalInfo'))
    } else if (militaryHistoryNotLoaded) {
      setDisplayMessage(t('sync.progress.military'))
    } else {
      setDisplayMessage(t('sync.progress.signin'))
    }

    if (!personalInformationNotLoaded && !militaryHistoryNotLoaded && loggedIn) {
      dispatch(completeSync())
    }
  }, [dispatch, loggedIn, personalInformationNotLoaded, militaryHistoryNotLoaded, t])

  return (
    <ScrollView contentContainerStyle={splashStyles}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
        <VAIcon name={'Logo'} />
        <Box flexDirection={'row'} alignItems={'center'} justifyContent={'center'} mx={theme.dimensions.gutter}>
          <TextView justifyContent={'center'} color={'primaryContrast'} alignItems={'center'} textAlign={'center'}>
            {displayMessage}
          </TextView>
        </Box>
      </Box>
    </ScrollView>
  )
}

export default SyncScreen
