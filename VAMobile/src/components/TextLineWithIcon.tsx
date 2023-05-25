import React, { FC } from 'react'

import { TextLine } from './types'
import { VATheme } from 'styles/theme'
import { useTheme } from 'styled-components'
import Box from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

export type TextLineWithIconProps = {
  /** Props for icon you want to display in this line of text */
  iconProps?: VAIconProps & {
    /** If the icon is supposed to appear on its own line (ex: read tag) */
    isOwnLine?: boolean
  }
} & TextLine

/**Common component to show an icon with a line of text*/
export const TextLineWithIcon: FC<TextLineWithIconProps> = ({ iconProps, text, variant, textAlign, color }) => {
  const theme = useTheme() as VATheme
  const iconNotOwnRow = !(iconProps && iconProps.isOwnLine)

  return (
    <Box flexDirection={'row'} alignItems={'center'}>
      <Box ml={iconNotOwnRow ? 0 : theme.dimensions.listItemDecoratorMarginLeft} mr={theme?.dimensions.condensedMarginBetween}>
        {iconProps && <VAIcon name={iconProps.name} width={iconProps.width} height={iconProps.height} fill={iconProps.fill} />}
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
