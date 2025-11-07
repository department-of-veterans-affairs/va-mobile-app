import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, LargePanel, TextView } from 'components'
import PhoneNumberComponent from 'components/PhoneNumberComponent'
import { NAMESPACE } from 'constants/namespaces'
import { PaymentsStackParamList } from 'screens/PaymentsScreen/PaymentsStackScreens'
import { useTheme } from 'utils/hooks'

type DebtHelpProps = StackScreenProps<PaymentsStackParamList, 'DebtHelp'>

function DebtHelp({}: DebtHelpProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { gutter, condensedMarginBetween } = theme.dimensions

  return (
    <LargePanel title={t('debts.help.title')} rightButtonText={t('close')}>
      <Box mx={gutter}>
        <Trans
          i18nKey={'debts.help.questions'}
          components={{
            // This handles bolding the header text
            header: <TextView variant="MobileBodyBold" accessibilityRole="header" />,
            // This handles paragraphs and their spacing
            p: <TextView my={condensedMarginBetween} variant="MobileBody" />,
            // This handles phone number links
            tel: <PhoneNumberComponent variant="standalone" ttyBypass={true} />,
            tty: <PhoneNumberComponent variant="standalone" />,
          }}
        />
      </Box>
    </LargePanel>
  )
}

export default DebtHelp
