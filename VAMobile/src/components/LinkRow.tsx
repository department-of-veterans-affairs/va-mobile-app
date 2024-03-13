import React, { FC } from 'react'
import { Pressable, ViewStyle } from 'react-native'

import { BackgroundVariant, TextView, VAIcon } from 'components'
import { useTheme } from 'utils/hooks'

type LinkRowProps = {
  /** Text for row title */
  title: string
  /** Optional Accessibility label for title */
  titleA11yLabel?: string
  /** Function called when pressed */
  onPress: () => void
}
const LinkRow: FC<LinkRowProps> = ({ title, titleA11yLabel, onPress }: LinkRowProps) => {
  const theme = useTheme()

  const pressableStyle: ViewStyle = {
    borderRadius: 8,
    padding: theme.dimensions.buttonPadding,
    backgroundColor: theme.colors.background.linkRow as BackgroundVariant,
    marginBottom: theme.dimensions.condensedMarginBetween,
    flexDirection: 'row',
    alignItems: 'center',
  }

  return (
    <Pressable style={pressableStyle} onPress={onPress} accessible={true} accessibilityRole={'link'}>
      <TextView flex={1} width={'100%'} variant={'HomeScreen'} accessibilityLabel={titleA11yLabel}>
        {title}
      </TextView>
      <VAIcon width={14} height={14} name={'ChevronRight'} fill={theme.colors.icon.linkRow} />
    </Pressable>
  )
}

export default LinkRow
