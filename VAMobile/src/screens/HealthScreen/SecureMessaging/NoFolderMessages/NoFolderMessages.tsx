import React, { FC } from 'react'

import { Box, FooterButton, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { SecureMessagingTabTypesConstants } from 'store/api/types'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

export type NoFolderMessagesProps = {
  folderName: string
}

const NoFolderMessages: FC<NoFolderMessagesProps> = ({ folderName }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const onGoToInbox = navigateTo('SecureMessaging', { initialTab: SecureMessagingTabTypesConstants.INBOX })

  return (
    <>
      <Box flex={1} justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
        <Box accessible={true} mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header">
            {t('secureMessaging.folders.noFolderMessages', { folderName })}
          </TextView>
        </Box>
        <Box accessible={true} width={'100%'}>
          <VAButton buttonType={'buttonPrimary'} label={'Go to Inbox'} onPress={onGoToInbox} a11yHint={t('secureMessaging.goToInbox.a11yHint')} />
        </Box>
      </Box>
      <FooterButton text={t('secureMessaging.composeMessage')} iconProps={{ name: 'Compose' }} />
    </>
  )
}

export default NoFolderMessages
