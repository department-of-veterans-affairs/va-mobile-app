import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { DebtRecord } from 'api/types/DebtData'
import { Box } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type MakePaymentButtonProps = {
  debt: DebtRecord
}

function MakePaymentButton({ debt }: MakePaymentButtonProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  function onButtonPress() {
    navigateTo('PayDebt', { debt })
  }

  return (
    <Box my={theme.dimensions.buttonPadding}>
      <Button label={t('debts.makePayment')} onPress={onButtonPress} />
    </Box>
  )
}

export default MakePaymentButton
