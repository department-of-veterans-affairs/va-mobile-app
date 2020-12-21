import { Box, TextView, VAIcon } from 'components'
import { ScrollView, ViewStyle } from 'react-native'
import { useTheme } from 'utils/hooks'
import React, { FC } from 'react'

export type SyncScreenProps = {}
const SyncScreen: FC<SyncScreenProps> = () => {
  const theme = useTheme()
  const splashStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.splashScreen,
  }

  // TODO set up store and api calls to show different text as time goes on or fake it

  return (
    <ScrollView contentContainerStyle={splashStyles}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
        <VAIcon name={'Logo'} />
        <Box flexDirection={'row'} alignItems={'center'} justifyContent={'center'} mx={theme.dimensions.gutter}>
          <VAIcon name={'CheckMark'} fill="#fff" />
          <TextView justifyContent={'flex-start'} ml={10} color={'primaryContrast'}>
            Connecting...
          </TextView>
        </Box>
      </Box>
    </ScrollView>
  )
}

export default SyncScreen
