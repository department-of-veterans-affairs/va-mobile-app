import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { MedicalCopayRecord } from 'api/types'
import { Box } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useShowActionSheet } from 'utils/hooks'

type ResolveCopayButtonProps = {
  copay?: MedicalCopayRecord
}

function ResolveCopayButton({ copay }: ResolveCopayButtonProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const showActionSheet = useShowActionSheet()

  function onButtonPress() {
    const options = [
      t('copays.resolveCopay.makeAPayment'),
      t('copays.resolveCopay.requestHelp'),
      t('copays.resolveCopay.disputeCopay'),
      t('cancel'),
    ]
    const routeNames = ['PayBill', 'CopayRequestHelp', 'DisputeCopay']

    showActionSheet(
      {
        options,
        title: t('copays.resolveCopay'),
        message: t('copays.resolveCopay.how'),
        cancelButtonIndex: 3,
      },
      (buttonIndex) => {
        if (buttonIndex !== undefined && buttonIndex < 3) {
          const routeName = routeNames[buttonIndex]
          if (routeName === 'PayBill') {
            navigateTo(routeName, { copay })
          } else {
            navigateTo(routeName)
          }
        }
      },
    )
  }

  return (
    <Box>
      <Button label={t('copays.resolveCopay')} onPress={onButtonPress} />
    </Box>
  )
}

export default ResolveCopayButton
