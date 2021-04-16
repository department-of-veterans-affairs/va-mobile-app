import React, { FC } from 'react'

import { TextLine } from './types'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import TextView from './TextView'
import VAIcon, { VA_ICON_MAP } from './VAIcon'

type TextLinesWithIconProps = {
  /** List of text for the button */
  listOfText?: Array<TextLine>
  /** For optional icons to be displayed next to a particular text line*/
  /** Map of key-value pairs where key is line number and value is icon name */
  iconList?: Map<number, keyof typeof VA_ICON_MAP>
}

export const TextLinesWithIcon: FC<TextLinesWithIconProps> = ({ listOfText, iconList }) => {
  const themes = useTheme()
  return (
    <Box flex={1}>
      <Box flexDirection="column">
        {listOfText?.map((textObj: TextLine, index: number) => {
          const { text, variant = 'MobileBody', color = 'primary', textAlign = 'left' } = textObj
          const iconName = iconList && iconList.get(index)
          return (
            <Box key={index} flexDirection={'row'}>
              <Box mt={themes.dimensions.navigationBarIconMarginTop} mr={themes.dimensions.condensedMarginBetween}>
                {iconName && <VAIcon name={iconName} width={16} height={16} fill={'spinner'} />}
                {!iconList || (!iconList.has(index) && <Box mr={themes.dimensions.messageIconLeftMargin} />)}
              </Box>
              <TextView variant={variant} textAlign={textAlign} color={color}>
                {text}
              </TextView>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
