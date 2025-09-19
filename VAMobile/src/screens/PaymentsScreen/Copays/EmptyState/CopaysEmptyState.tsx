import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, TextArea, TextView } from 'components'
import ClickToCallPhoneNumber from 'components/ClickToCallPhoneNumber'
import { NAMESPACE } from 'constants/namespaces'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

/**
 * Empty state shown when the Veteran has no copay bills in the last 6 months.
 */
const CopaysEmptyState = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const phone = '8664001238'

  return (
    <Box>
      <TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('copays.empty.title')}
        </TextView>

        <TextView mt={20} mb={20}>
          {t('copays.empty.body')}
        </TextView>

        <ClickToCallPhoneNumber displayedText={displayedTextPhoneNumber(phone)} phone={phone} />
      </TextArea>
    </Box>
  )
}

export default CopaysEmptyState
