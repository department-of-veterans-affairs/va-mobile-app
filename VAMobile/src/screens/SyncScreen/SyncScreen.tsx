import { ScrollView, ViewStyle } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { Box, TextView, VAIcon } from 'components'
import { completeSync } from 'store/actions'
import { useTheme } from 'utils/hooks'

export type SyncScreenProps = {}
const SyncScreen: FC<SyncScreenProps> = () => {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.splashScreen,
  }
  const dispatch = useDispatch()

  const { loggedIn } = useSelector<StoreState, AuthState>((state) => state.auth)

  // TODO: set up store and api calls to show different text as time goes on or fake it
  // TODO: add values to theme dimensions
  useEffect(() => {
    // dispatch(getProfileInfo())
    // dispatch(getServiceHistory())
    if (loggedIn) {
      dispatch(completeSync())
    }
  }, [dispatch, loggedIn])

  return (
    <ScrollView contentContainerStyle={splashStyles}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
        <VAIcon name={'Logo'} />
        <Box flexDirection={'row'} alignItems={'center'} justifyContent={'center'} mx={theme.dimensions.gutter}>
          <VAIcon name={'CheckMark'} fill="#fff" height={20} width={20} />
          <TextView justifyContent={'center'} ml={10} color={'primaryContrast'} alignItems={'center'} textAlign={'center'}>
            Connecting...
          </TextView>
        </Box>
      </Box>
    </ScrollView>
  )
}

export default SyncScreen
