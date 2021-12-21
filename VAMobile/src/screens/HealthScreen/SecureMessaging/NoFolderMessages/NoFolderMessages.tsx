import { useDispatch } from 'react-redux'
import React, { FC } from 'react'

import { Box, TextView, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingTabTypesConstants } from 'store/api/types'
import { ViewStyle } from 'react-native'
import { updateSecureMessagingTab } from 'store/actions'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ComposeMessageFooter from '../ComposeMessageFooter/ComposeMessageFooter'

export type NoFolderMessagesProps = {
  folderName: string
}

const NoFolderMessages: FC<NoFolderMessagesProps> = ({ folderName }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigateTo = useRouteNavigation()

  const onGoToInbox = (): void => {
    dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))
    navigateTo('SecureMessaging')()
  }

  const noEntriesTextKey = folderName === 'Drafts' ? 'secureMessaging.folders.noDrafts' : 'secureMessaging.folders.noFolderMessages'

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  return (
    <>
      <VAScrollView contentContainerStyle={scrollStyles}>
        <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
          <TextView variant="MobileBodyBold" color={'primaryTitle'} textAlign="center" accessibilityRole="header" mb={theme.dimensions.standardMarginBetween}>
            {t(noEntriesTextKey, { folderName })}
          </TextView>
          <Box width={'100%'}>
            <VAButton buttonType={'buttonPrimary'} label={t('secureMessaging.goToInbox')} onPress={onGoToInbox} a11yHint={t('secureMessaging.goToInbox.a11yHint')} />
          </Box>
        </Box>
      </VAScrollView>
      <ComposeMessageFooter />
    </>
  )
}

export default NoFolderMessages
