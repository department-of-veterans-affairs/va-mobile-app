import React, { FC } from 'react'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'
import { IconProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'

import { useTheme } from 'utils/hooks'

import Box from './Box'
import TextView from './TextView'
import { InlineText } from './types'

export type InlineTextWithIconsProps = {
  /** replaces left text with icon when true */
  inlineIcon?: boolean

  /** Props for icon you want to display in this line of text */
  leftIconProps?: IconProps

  /** Props for icon you want to display in this line of text */
  rightIconProps?: IconProps
} & InlineText

/**Common component to show an icon with a line of text*/
export const InlineTextWithIcons: FC<InlineTextWithIconsProps> = ({
  inlineIcon,
  leftIconProps,
  rightIconProps,
  leftTextProps,
  rightTextProps,
}) => {
  const theme = useTheme()
  return (
    <Box flexDirection={'row'} flexGrow={1}>
      {!inlineIcon && leftIconProps && (
        <Box mt={7} mr={theme.dimensions.condensedMarginBetween}>
          <Icon {...leftIconProps} />
        </Box>
      )}
      {inlineIcon && leftIconProps ? (
        <Icon {...leftIconProps} />
      ) : (
        <TextView
          mr={theme.dimensions.condensedMarginBetween}
          flex={7}
          variant={leftTextProps.variant}
          textAlign={leftTextProps.textAlign}
          color={leftTextProps.color}>
          {leftTextProps.text}
        </TextView>
      )}
      {rightTextProps && (
        <TextView
          variant={rightTextProps.variant}
          textAlign={rightTextProps.textAlign}
          color={rightTextProps.color}
          flex={3}>
          {rightTextProps.text}
        </TextView>
      )}
      {rightIconProps && (
        <Box mt={7}>
          <Icon {...rightIconProps} />
        </Box>
      )}
    </Box>
  )
}

export default InlineTextWithIcons
