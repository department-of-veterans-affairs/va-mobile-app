import React, { FC } from 'react'

import { TextLine } from './types'
import Box from './Box'
import MessagesSentReadTag from './MessagesSentReadTag'
import TextLineWithIcon, { TextLineWithIconProps } from './TextLineWithIcon'
import TextView from './TextView'

type TextLinesProps = {
  /** List of text for the button */
  listOfText?: Array<TextLine | TextLineWithIconProps>
  /** if true the text will be selectable */
  selectable?: boolean
}

/**Component to render individual lines of text. Each text line will wrap as needed and subsequent lines will be on the next line*/
export const TextLines: FC<TextLinesProps> = ({ listOfText, selectable }) => {
  return (
    <Box flex={1}>
      <Box flexDirection="column">
        {listOfText?.map((textObj: TextLine | TextLineWithIconProps, index: number) => {
          if ('iconProps' in textObj && textObj.iconProps !== undefined) {
            return <TextLineWithIcon key={index} {...textObj} />
          } else {
            const { text, variant = 'MobileBody', color = 'primary', textAlign = 'left', isTextTag = false } = textObj
            if (isTextTag) {
              return <MessagesSentReadTag text={text} key={index} />
            }
            return (
              <TextView variant={variant} textAlign={textAlign} color={color} key={index} selectable={selectable}>
                {text}
              </TextView>
            )
          }
        })}
      </Box>
    </Box>
  )
}
