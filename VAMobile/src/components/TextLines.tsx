import React, { FC } from 'react'

import { TextLine } from './types'
import Box from './Box'
import TextView from './TextView'

type ListOfTextProps = {
  /** List of text for the button */
  listOfText?: Array<TextLine>
}

export const ListOfText: FC<ListOfTextProps> = ({ listOfText }) => {
  return (
    <Box flex={1}>
      <Box flexDirection="column">
        {listOfText?.map((textObj, index) => {
          const { text, variant = 'MobileBody', color = 'primary', textAlign = 'left' } = textObj
          return (
            <TextView variant={variant} textAlign={textAlign} color={color} key={index}>
              {text}
            </TextView>
          )
        })}
      </Box>
    </Box>
  )
}
