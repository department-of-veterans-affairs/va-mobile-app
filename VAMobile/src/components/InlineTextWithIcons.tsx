import React, { FC } from 'react'

import { Icon, IconProps } from '@department-of-veterans-affairs/mobile-component-library'

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
    <Box flexDirection={'row'} flexGrow={1} alignItems="center">
      {!inlineIcon && leftIconProps && (
        <Box mr={theme.dimensions.condensedMarginBetween}>
          {leftIconProps?.svg ? (
            <Icon
              svg={leftIconProps.svg}
              width={leftIconProps.width ?? 24}
              height={leftIconProps.height ?? 24}
              fill={leftIconProps.fill}
              testID={leftIconProps.testID}
            />
          ) : leftIconProps?.name ? (
            <Icon
              name={leftIconProps.name}
              width={leftIconProps.width ?? 24}
              height={leftIconProps.height ?? 24}
              fill={leftIconProps.fill}
              testID={leftIconProps.testID}
            />
          ) : null}
        </Box>
      )}
      {inlineIcon && leftIconProps ? (
        leftIconProps.svg ? (
          <Icon svg={leftIconProps.svg} fill={leftIconProps.fill} testID={leftIconProps.testID} />
        ) : leftIconProps.name ? (
          <Icon
            name={leftIconProps.name}
            width={leftIconProps.width ?? 24}
            height={leftIconProps.height ?? 24}
            fill={leftIconProps.fill}
            testID={leftIconProps.testID}
          />
        ) : null
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
          <Icon
            name={rightIconProps.name ?? 'Close'}
            width={rightIconProps.width ?? 24}
            height={rightIconProps.height ?? 24}
            fill={rightIconProps.fill}
            testID={rightIconProps.testID}
          />
        </Box>
      )}
    </Box>
  )
}

export default InlineTextWithIcons
