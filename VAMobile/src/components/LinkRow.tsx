import React, { FC } from 'react'
import { Pressable, PressableStateCallbackType, ViewStyle } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { TextView } from 'components'
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

  const pressableStyle = ({ pressed }: PressableStateCallbackType): ViewStyle => ({
    borderRadius: 8,
    paddingLeft: theme.dimensions.buttonPadding,
    paddingRight: theme.dimensions.tinyMarginBetween,
    paddingVertical: theme.dimensions.buttonPadding,
    backgroundColor: pressed ? theme.colors.background.listActive : theme.colors.background.linkRow,
    marginBottom: theme.dimensions.condensedMarginBetween,
    flexDirection: 'row',
    alignItems: 'center',
  })

  return (
    <Pressable style={pressableStyle} onPress={onPress} accessible={true} accessibilityRole={'link'}>
      <TextView flex={1} width={'100%'} variant={'HomeScreen'} accessibilityLabel={titleA11yLabel}>
        {title}
      </TextView>
      <Icon width={26} height={26} preventScaling={true} name={'ChevronRight'} fill={theme.colors.icon.linkRow} />
    </Pressable>
  )
}

export default LinkRow
