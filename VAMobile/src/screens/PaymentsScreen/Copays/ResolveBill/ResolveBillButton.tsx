import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { Box } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useShowActionSheet, useTheme } from 'utils/hooks'

function ResolveBillButton() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const showActionSheet = useShowActionSheet()

  function onButtonPress() {
    const options = [
      t('copays.resolveBill.payBill'),
      t('copays.resolveBill.requestHelp'),
      t('copays.resolveBill.disputeCopay'),
      t('cancel'),
    ]
    const routeNames = ['PayBill', 'CopayRequestHelp', 'DisputeCopay']

    showActionSheet(
      {
        options,
        title: t('copays.resolveBill'),
        message: t('copays.resolveBill.how'),
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
      <Button label={t('copays.resolveBill')} onPress={onButtonPress} />
    </Box>
  )
}

export default ResolveBillButton
