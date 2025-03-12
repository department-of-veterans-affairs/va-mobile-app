import React, { FC } from 'react'

import { Icon, IconProps } from '@department-of-veterans-affairs/mobile-component-library'

import { useTheme } from 'utils/hooks'

import Box from './Box'
import TextView from './TextView'
import { TextLine } from './types'

export type TextLineWithIconProps = {
  /** Props for icon you want to display in this line of text */
  iconProps?: IconProps & {
    /** If the icon is supposed to appear on its own line (ex: read tag) */
    isOwnLine?: boolean
  }
} & TextLine

/**Common component to show an icon with a line of text*/
export const TextLineWithIcon: FC<TextLineWithIconProps> = ({ iconProps, text, variant, textAlign, color }) => {
  const themes = useTheme()
  const iconNotOwnRow = !(iconProps && iconProps.isOwnLine)

  return (
    <Box flexDirection={'row'} alignItems={'center'}>
      <Box
        ml={iconNotOwnRow ? 0 : themes.dimensions.listItemDecoratorMarginLeft}
        mr={themes.dimensions.condensedMarginBetween}>
        {iconProps?.svg ? (
          <Icon
            svg={iconProps.svg}
            width={iconProps.width ?? 24}
            height={iconProps.height ?? 24}
            fill={iconProps.fill}
            testID={iconProps.testID}
          />
        ) : iconProps?.name ? (
          <Icon
            name={iconProps.name}
            width={iconProps.width ?? 24}
            height={iconProps.height ?? 24}
            fill={iconProps.fill}
            testID={iconProps.testID}
          />
        ) : null}
        {!iconProps && <Box mr={16} />}
      </Box>
      {iconNotOwnRow && (
        <TextView flex={1} variant={variant} textAlign={textAlign} color={color}>
          {text}
        </TextView>
      )}
    </Box>
  )
}

export default TextLineWithIcon
