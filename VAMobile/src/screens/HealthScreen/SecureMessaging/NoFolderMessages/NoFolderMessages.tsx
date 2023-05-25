import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingTabTypesConstants } from 'store/api/types'
import { VATheme } from 'styles/theme'
import { ViewStyle } from 'react-native'
import { updateSecureMessagingTab } from 'store/slices'
import { useRouteNavigation } from 'utils/hooks'
import { useTheme } from 'utils/hooks'
import ComposeMessageButton from '../ComposeMessageButton/ComposeMessageButton'

const NoFolderMessages: FC = () => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme() as VATheme
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()

  const onGoToInbox = (): void => {
    dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))
    navigateTo('SecureMessaging')()
  }

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  return (
    <>
      <VAScrollView contentContainerStyle={scrollStyles}>
        <ComposeMessageButton />
        <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
          <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header" mb={theme.dimensions.standardMarginBetween}>
            {t('secureMessaging.folders.noFolderMessages')}
          </TextView>
          <Box width={'100%'}>
            <VAButton buttonType={'buttonPrimary'} label={t('secureMessaging.goToInbox')} onPress={onGoToInbox} a11yHint={t('secureMessaging.goToInbox.a11yHint')} />
          </Box>
        </Box>
      </VAScrollView>
    </>
  )
}

export default NoFolderMessages
