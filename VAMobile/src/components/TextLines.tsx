import React, { FC } from 'react'

import { TextLine } from './types'
import Box from './Box'
import TextLineWithIcon, { TextLineWithIconProps } from './TextLineWithIcon'
import TextView from './TextView'

type TextLinesProps = {
  /** List of text for the button */
  listOfText?: Array<TextLine | TextLineWithIconProps>
}

export const TextLines: FC<TextLinesProps> = ({ listOfText }) => {
  return (
    <Box flex={1}>
      <Box flexDirection="column">
        {listOfText?.map((textObj: TextLine | TextLineWithIconProps, index: number) => {
          if ('iconProps' in textObj && textObj.iconProps !== undefined) {
            return <TextLineWithIcon key={index} {...textObj} />
          } else {
            const { text, variant = 'MobileBody', color = 'primary', textAlign = 'left' } = textObj
            return (
              <TextView variant={variant} textAlign={textAlign} color={color} key={index}>
                {text}
              </TextView>
            )
          }
        })}
      </Box>
    </Box>
  )
}
