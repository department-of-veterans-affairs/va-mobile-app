import React, { FC } from 'react'

import { TextLine } from './types'
import { useTheme } from 'utils/hooks'
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

export const TextLineWithIcon: FC<TextLineWithIconProps> = ({ iconProps, text, variant, textAlign, color }) => {
  const themes = useTheme()
  const iconNotOwnRow = !(iconProps && iconProps.isOwnLine)

  return (
    <Box flexDirection={'row'}>
      <Box ml={iconNotOwnRow ? 0 : themes.dimensions.listItemDecoratorMarginLeft} mt={themes.dimensions.navigationBarIconMarginTop} mr={themes.dimensions.condensedMarginBetween}>
        {iconProps && <VAIcon name={iconProps.name} width={iconProps.width} height={iconProps.height} fill={iconProps.fill} />}
        {!iconProps && <Box mr={themes.dimensions.messageIconLeftMargin} />}
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
