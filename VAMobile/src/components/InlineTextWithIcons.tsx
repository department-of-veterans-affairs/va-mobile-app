import React, { FC } from 'react'

import { useTheme } from 'utils/hooks'

import Box from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'
import { InlineText } from './types'

export type InlineTextWithIconsProps = {
  /** replaces left text with icon when true */
  inlineIcon?: boolean

  /** Props for icon you want to display in this line of text */
  leftIconProps?: VAIconProps

  /** Props for icon you want to display in this line of text */
  rightIconProps?: VAIconProps
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
          <VAIcon
            name={leftIconProps.name}
            width={leftIconProps.width}
            height={leftIconProps.height}
            fill={leftIconProps.fill}
            testID={leftIconProps.testID}
          />
        </Box>
      )}
      {inlineIcon && leftIconProps ? (
        <VAIcon
          name={leftIconProps.name}
          width={leftIconProps.width}
          height={leftIconProps.height}
          fill={leftIconProps.fill}
          testID={leftIconProps.testID}
        />
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
          <VAIcon
            name={rightIconProps.name}
            width={rightIconProps.width}
            height={rightIconProps.height}
            fill={rightIconProps.fill}
            testID={rightIconProps.testID}
          />
        </Box>
      )}
    </Box>
  )
}

export default InlineTextWithIcons
