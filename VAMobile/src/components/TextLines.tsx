import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { TextLine } from './types'
import { useTranslation } from 'utils/hooks'
import Box from './Box'
import MessagesSentReadTag from './MessagesSentReadTag'
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
            const { text, variant = 'MobileBody', color = 'primary', textAlign = 'left', isTextTag = false } = textObj
            if (isTextTag) {
              return <MessagesSentReadTag text={text} key={index} />
            }
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
