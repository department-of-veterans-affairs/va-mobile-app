import React, { FC } from 'react'

import { TextLine } from './types'
import Box from './Box'
import LabelTag from './LabelTag'
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
            const { text, variant = 'MobileBody', color, textAlign = 'left', textTag, mt, mb } = textObj
            if (textTag) {
              return (
                <Box mt={mt} mb={mb} key={index}>
                  <LabelTag text={text} key={index} labelType={textTag.labelType} />
                </Box>
              )
            }

            return (
              <TextView variant={variant} textAlign={textAlign} color={color} key={index} selectable={selectable} mt={mt} mb={mb} accessible={false}>
                {text}
              </TextView>
            )
          }
        })}
      </Box>
    </Box>
  )
}
