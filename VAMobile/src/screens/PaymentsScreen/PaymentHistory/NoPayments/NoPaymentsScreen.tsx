import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, ClickToCallPhoneNumber, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { useTheme } from 'utils/hooks'

const NoPaymentsScreen: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <VAScrollView>
      <Box mt={theme.dimensions.standardMarginBetween}>
        <AlertBox title={t('payments.noPayments.title')} border="informational" text={t('payments.noPayments.body')}>
          <ClickToCallPhoneNumber phone={t('8008271000')} displayedText={t('8008271000.displayText')} />
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default NoPaymentsScreen
