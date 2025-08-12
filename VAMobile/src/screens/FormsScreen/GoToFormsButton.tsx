import { Pressable, TextStyle, ViewStyle } from 'react-native'
import React, { FC } from 'react'
import { font, spacing } from '@department-of-veterans-affairs/mobile-tokens'
import { Icon } from "@department-of-veterans-affairs/mobile-component-library";

import { useRouteNavigation, useTheme } from 'utils/hooks'
import { Box, TextView } from 'components'

/**
 * Forms Button for the Home Screen
 */

export const GoToFormsButton: FC = () => {
  const theme = useTheme()
  const { typography, family } = font
  const navigateTo = useRouteNavigation()
  const text = 'Go to my forms'

  const buttonStyle: ViewStyle = {
    width: '100%',
    alignItems: 'center',
    padding: spacing.vadsSpaceSm,
    backgroundColor: theme.colors.background.textBox,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border.divider
  }

  const textStyle: TextStyle = {
    ...typography.vadsFontBodyLarge,
    fontFamily: family.vadsFontFamilySansSerifBold,
    marginBottom: spacing.vadsSpaceNone,
    color: theme.colors.text.input
  }

  return (
    <Pressable
      style={buttonStyle}
      accessibilityRole="button"
      accessible={true}
      onPress={() => {
        navigateTo('FormsTab')
      }}
      accessibilityHint={text}
      accessibilityLabel={text}>
      <Box width='100%' flexDirection={'row'} alignItems={'center'} justifyContent='space-between'>
        <TextView style={textStyle}>{text}</TextView>
        <Icon
          width={24}
          height={24}
          name={'ChevronRight'}
          fill={theme.colors.icon.ussf}
          preventScaling={true}
        />
      </Box>
    </Pressable>
  )
}
