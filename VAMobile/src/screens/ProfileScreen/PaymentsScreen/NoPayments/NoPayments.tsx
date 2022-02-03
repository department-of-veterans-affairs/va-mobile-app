import React, { FC } from 'react'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const NoInboxMessages: FC = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
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
        <TextView variant="MobileBodyBold" color={'primaryTitle'} textAlign="center" accessibilityRole="header">
          {t('payments.noPayments.title')}
        </TextView>
      </Box>
      <Box accessible={true}>
        <TextView variant="MobileBody" textAlign="center" my={theme.dimensions.standardMarginBetween} {...testIdProps(t('payments.noPayments.body'))}>
          {t('payments.noPayments.body')}
        </TextView>
      </Box>
    </Box>
  )
}

export default NoInboxMessages
