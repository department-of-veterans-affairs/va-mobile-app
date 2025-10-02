import React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, ClickToCallPhoneNumber, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

interface CopayEmptyStateProps {
  testID?: string
}

function CopayEmptyState({ testID }: CopayEmptyStateProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <TextArea testID={testID}>
      <Box accessibilityRole="header" accessible={true}>
        <TextView variant="MobileBodyBold">{t('copays.none.header')}</TextView>
      </Box>
      <TextView my={theme.dimensions.standardMarginBetween} variant="MobileBody">
        {t('copays.none.message')}
      </TextView>
      <ClickToCallPhoneNumber phone={t('8664001238')} displayedText={displayedTextPhoneNumber(t('8664001238'))} />
    </TextArea>
  )
}

export default CopayEmptyState
