import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

const DatePicker = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <Box mx={theme.dimensions.gutter}>
      <Box borderTopWidth={theme.dimensions.borderWidth} borderStyle="solid" borderColor="primary">
        <Box backgroundColor={'list'}>
          <Box flex={1} flexDirection="row" justifyContent="space-between">
            <TextView>From</TextView>
            <Box>
              <TextView>April 18, 2025</TextView>
            </Box>
          </Box>
          <Box flex={1} flexDirection="row" justifyContent="space-between">
            <TextView>To</TextView>
            <Box>
              <TextView>July 18, 2025</TextView>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box pt={theme.dimensions.standardMarginBetween}>
        <Button onPress={() => {}} label={t('apply')} buttonType={ButtonVariants.Primary} />
      </Box>
    </Box>
  )
}

export default DatePicker
