import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextView } from 'components'
import { useTheme } from 'utils/hooks'

type InlineCopyLinkCopayProps = {
  label?: string
  onPress: () => void
  testID?: string
}

export function InlineCopyLinkCopay({ label = 'Copy', onPress, testID }: InlineCopyLinkCopayProps) {
  const theme = useTheme()
  const color = theme.colors.icon.active

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={label}
      testID={testID}
      style={[styles.pressable, { minHeight: theme.dimensions.touchableMinHeight }]}>
      <Box flexDirection="row" alignItems="center">
        <Icon name="ContentCopy" fill={color} width={24} height={24} />
        <TextView ml={6} variant="HelperTextBold" color="link">
          {label}
        </TextView>
      </Box>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  pressable: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
})
