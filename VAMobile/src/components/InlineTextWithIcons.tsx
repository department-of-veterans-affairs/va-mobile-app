import React, { FC } from 'react'

import { InlineText, TextLine } from './types'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

export type InlineTextWithIconsProps = {
  /** replaces left text with icon hen true */
  inlineIcon?: boolean

  /** Props for icon you want to display in this line of text */
  leftIconProps?: VAIconProps

  /** Props for icon you want to display in this line of text */
  rightIconProps?: VAIconProps
} & InlineText

/**Common component to show an icon with a line of text*/
export const InlineTextWithIcons: FC<InlineTextWithIconsProps> = ({ inlineIcon, leftIconProps, rightIconProps, leftTextProps, rightTextProps }) => {
  const themes = useTheme()
  return (
    <Box flexDirection={'row'}>
      <Box ml={leftIconProps ? 0 : themes.dimensions.messagesDecoratorMarginLeft} mt={themes.dimensions.navigationBarIconMarginTop} mr={themes.dimensions.condensedMarginBetween}>
        {!inlineIcon && leftIconProps && <VAIcon name={leftIconProps.name} width={leftIconProps.width} height={leftIconProps.height} fill={leftIconProps.fill} />}
      </Box>
      {inlineIcon && leftIconProps ? (
        <VAIcon name={leftIconProps.name} width={leftIconProps.width} height={leftIconProps.height} fill={leftIconProps.fill} />
      ) : (
        <TextView flex={2} variant={leftTextProps.variant} textAlign={leftTextProps.textAlign} color={leftTextProps.color} numberOfLines={1}>
          {leftTextProps.text}
        </TextView>
      )}
      {rightTextProps && (
        <TextView flex={1} variant={rightTextProps.variant} textAlign={rightTextProps.textAlign} color={rightTextProps.color} numberOfLines={1}>
          {rightTextProps.text}
        </TextView>
      )}
      {rightIconProps && (
        <Box mt={themes.dimensions.navigationBarIconMarginTop}>
          <VAIcon name={rightIconProps.name} width={rightIconProps.width} height={rightIconProps.height} fill={rightIconProps.fill} />
        </Box>
      )}
    </Box>
  )
}

export default InlineTextWithIcons
