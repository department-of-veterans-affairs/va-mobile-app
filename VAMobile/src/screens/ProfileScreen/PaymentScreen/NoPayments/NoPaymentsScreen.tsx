import React, { FC } from 'react'

import { AlertBox, Box, ClickToCallPhoneNumber, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'

const NoPaymentsScreen: FC = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  return (
    <VAScrollView>
      <Box mt={standardMarginBetween} mx={theme.dimensions.gutter}>
        <AlertBox title={t('payments.noPayments.title')} border="informational" text={t('payments.noPayments.body')}>
          <ClickToCallPhoneNumber phone={t('common:8008271000')} displayedText={t('common:8008271000.displayText')} />
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default NoPaymentsScreen
