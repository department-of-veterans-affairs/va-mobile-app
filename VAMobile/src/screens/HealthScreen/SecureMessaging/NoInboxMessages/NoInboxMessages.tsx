import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const NoInboxMessages: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
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
      <Box accessible={true}>
        <TextView variant="MobileBody" textAlign="center" my={theme.dimensions.standardMarginBetween} {...testIdProps(t('secureMessaging.inbox.noMessages.body.a11y'))}>
          {t('secureMessaging.inbox.noMessages.body')}
        </TextView>
      </Box>
    </Box>
  )
}

export default NoInboxMessages
