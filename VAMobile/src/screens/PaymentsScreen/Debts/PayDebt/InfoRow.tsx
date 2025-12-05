import React from 'react'
import { Clipboard } from 'react-native'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextView } from 'components'
import { InlineCopyLink } from 'screens/PaymentsScreen/Debts/PayDebt/InlineCopyLink'
import { useTheme } from 'utils/hooks'

type InfoRowProps = {
  label: string
  value?: string
  copyable?: boolean
  testID?: string
}

export function InfoRow({ label, value, copyable = false, testID }: InfoRowProps) {
  const theme = useTheme()
  const snackbar = useSnackbar()
  const display = value && value.length > 0 ? value : '—'

  const handleCopy = () => {
    if (!value) return
    Clipboard.setString(value)
    snackbar.show(`${label} ${'copied'}`, {
      offset: theme.dimensions.snackBarBottomOffset,
    })
  }

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      pt={theme.dimensions.standardMarginBetween}>
      <Box flex={1} mr={theme.dimensions.condensedMarginBetween}>
        <TextView variant="MobileBody">{label}</TextView>
        <TextView mb={6} variant="MobileBodyBold" selectable testID={`${testID}-value`}>
          {display}
        </TextView>
      </Box>

      {copyable && value ? <InlineCopyLink onPress={handleCopy} testID={`${testID}-copy`} /> : null}
    </Box>
  )
}
