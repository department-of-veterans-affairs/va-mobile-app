import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, ClickToCallPhoneNumber, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

const NoPaymentsScreen: FC = () => {
  const { t } = useTranslation(NAMESPACE.PROFILE)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const standardMarginBetween = theme.dimensions.standardMarginBetween

  return (
    <VAScrollView>
      <Box mt={standardMarginBetween} mx={theme.dimensions.gutter}>
        <AlertBox title={t('payments.noPayments.title')} border="informational" text={t('payments.noPayments.body')}>
          <ClickToCallPhoneNumber phone={tc('8008271000')} displayedText={tc('8008271000.displayText')} />
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default NoPaymentsScreen
