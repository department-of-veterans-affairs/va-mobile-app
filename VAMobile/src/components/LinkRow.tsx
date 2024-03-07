import React, { FC } from 'react'
import { Pressable } from 'react-native'

import { BackgroundVariant, Box, BoxProps, TextView, VAIcon } from 'components'
import { useTheme } from 'utils/hooks'

type LinkRowProps = {
  title: string
  titleA11yLabel?: string
  onPress: () => void
}
const LinkRow: FC<LinkRowProps> = ({ title, titleA11yLabel, onPress }) => {
  const theme = useTheme()

  const boxProps: BoxProps = {
    borderRadius: 8,
    p: theme.dimensions.buttonPadding,
    backgroundColor: theme.colors.background.linkRow as BackgroundVariant,
    mb: theme.dimensions.condensedMarginBetween,
  }

  return (
    <Box {...boxProps}>
      <Pressable onPress={onPress} accessible={true} accessibilityRole={'link'}>
        <Box flex={1} flexDirection={'row'} alignItems="center">
          <TextView flex={1} variant={'HomeScreen'} accessibilityLabel={titleA11yLabel}>
            {title}
          </TextView>
          <VAIcon width={14} height={14} name={'ChevronRight'} fill={theme.colors.icon.linkRow} />
        </Box>
      </Pressable>
    </Box>
  )
}

export default LinkRow
