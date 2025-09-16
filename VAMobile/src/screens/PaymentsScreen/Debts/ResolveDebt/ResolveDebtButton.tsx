import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { Box } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useShowActionSheet, useTheme } from 'utils/hooks'

function ResolveDebtButton() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const showActionSheet = useShowActionSheet()

  function onButtonPress() {
    const options = [
      t('debts.resolveDebt.payDebt'),
      t('debts.resolveDebt.requestHelp'),
      t('debts.resolveDebt.disputeDebt'),
      t('cancel'),
    ]
    const routeNames = ['PayDebt', 'DebtRequestHelp', 'DisputeDebt']

    showActionSheet(
      {
        options,
        title: t('debts.resolveDebt'),
        message: t('debts.resolveDebt.how'),
        cancelButtonIndex: 3,
      },
      (buttonIndex) => {
        if (buttonIndex !== undefined && buttonIndex < 3) {
          navigateTo(routeNames[buttonIndex])
        }
      },
    )
  }

  return (
    <Box mx={theme.dimensions.cardPadding} my={theme.dimensions.buttonPadding}>
      <Button label={t('debts.resolveDebt')} onPress={onButtonPress} />
    </Box>
  )
}

export default ResolveDebtButton
