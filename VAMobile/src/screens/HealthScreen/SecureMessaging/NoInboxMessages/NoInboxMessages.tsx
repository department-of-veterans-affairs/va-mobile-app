import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

function NoInboxMessages() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <Box
      {...testIdProps('Messages: No-messages-page')}
      flex={1}
      justifyContent="center"
      mx={theme.dimensions.gutter}
      alignItems="center"
      mt={theme.dimensions.standardMarginBetween}>
      <Box accessible={true} accessibilityRole={'header'}>
        <TextView variant="MobileBodyBold" textAlign="center" accessibilityRole="header">
          {t('secureMessaging.inbox.noMessages.title')}
        </TextView>
      </Box>
      <Box accessible={true} accessibilityRole={'text'}>
        <TextView variant="MobileBody" textAlign="center" my={theme.dimensions.standardMarginBetween}>
          {t('secureMessaging.inbox.noMessages.body')}
        </TextView>
      </Box>
    </Box>
  )
}

export default NoInboxMessages
