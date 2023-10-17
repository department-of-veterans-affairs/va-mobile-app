import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { SegmentedControlIndexes } from 'constants/secureMessaging'
import { ViewStyle } from 'react-native'
import { updateSecureMessagingTab } from 'store/slices'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import StartNewMessageButton from '../StartNewMessageButton/StartNewMessageButton'

const NoFolderMessages: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()

  const onGoToInbox = (): void => {
    dispatch(updateSecureMessagingTab(SegmentedControlIndexes.INBOX))
    navigateTo('SecureMessaging')()
  }

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  return (
    <>
      <VAScrollView contentContainerStyle={scrollStyles}>
        <StartNewMessageButton />
        <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
          <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header" mb={theme.dimensions.standardMarginBetween}>
            {t('secureMessaging.folders.noFolderMessages')}
          </TextView>
          <Box width={'100%'}>
            <VAButton buttonType={'buttonPrimary'} label={t('secureMessaging.goToInbox')} onPress={onGoToInbox} />
          </Box>
        </Box>
      </VAScrollView>
    </>
  )
}

export default NoFolderMessages
