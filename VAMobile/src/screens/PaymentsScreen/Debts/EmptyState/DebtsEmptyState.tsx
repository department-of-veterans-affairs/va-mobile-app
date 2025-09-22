import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextArea, TextView } from 'components'
import ClickToCallPhoneNumber from 'components/ClickToCallPhoneNumber'
import { NAMESPACE } from 'constants/namespaces'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

/**
 * Empty state shown when the Veteran has no current VA debts.
 */
const DebtsEmptyState = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const phone = t('8008270648')

  return (
    <Box>
      <TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('debts.empty.title')}
        </TextView>

        <TextView mt={20} mb={20}>
          {t('debts.empty.body')}
        </TextView>

        <ClickToCallPhoneNumber displayedText={displayedTextPhoneNumber(phone)} phone={phone} />
      </TextArea>
    </Box>
  )
}

export default DebtsEmptyState
