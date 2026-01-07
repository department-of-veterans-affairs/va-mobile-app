import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { DebtRecord } from 'api/types/DebtData'
import { Box } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useShowActionSheet, useTheme } from 'utils/hooks'

type ResolveDebtButtonProps = {
  debt: DebtRecord
}

function ResolveDebtButton({ debt }: ResolveDebtButtonProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const showActionSheet = useShowActionSheet()

  function onButtonPress() {
    const options = [
      t('debts.resolveOverpayment.payDebt'),
      t('debts.resolveOverpayment.requestHelp'),
      t('debts.resolveOverpayment.disputeDebt'),
      t('cancel'),
    ]
    const routeNames = ['PayDebt', 'DebtRequestHelp', 'DisputeDebt']

    showActionSheet(
      {
        options,
        title: t('debts.resolveOverpayment'),
        message: t('debts.resolveOverpayment.how'),
        cancelButtonIndex: 3,
      },
      (buttonIndex) => {
        if (buttonIndex !== undefined && buttonIndex < 3) {
          navigateTo(routeNames[buttonIndex], { debt: debt })
        }
      },
    )
  }

  return (
    <Box my={theme.dimensions.buttonPadding}>
      <Button label={t('debts.resolveOverpayment')} onPress={onButtonPress} />
    </Box>
  )
}

export default ResolveDebtButton
