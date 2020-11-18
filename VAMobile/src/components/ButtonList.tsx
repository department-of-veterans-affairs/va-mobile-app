import { FC } from 'react'
import React from 'react'
import _ from 'underscore'

import { i18n_NS } from 'constants/namespaces'
import { useTranslation } from 'utils/hooks'
import Box from './Box'
import WideButton, { WideButtonProps, WideButtonTextItem } from './WideButton'

/**
 * Signifies a line of text in the button
 */
export type textLine = {
  /** string to display */
  text: string

  /** if true makes the line bold */
  isBold?: boolean
}

/**
 * Signifies each item in the list of items in {@link ButtonListProps}
 */
export type ButtonListItemObj = {
  /** lines of text to display */
  textLines: Array<textLine> | string

  /** optional text to use as the button's accessibility hint */
  a11yHintText?: string

  /** on press event */
  onPress?: () => void
} & Partial<WideButtonProps>

/**
 * Props for {@link ButtonList}
 */
export type ButtonListProps = {
  /** list of items of which a button will be rendered per item */
  items: Array<ButtonListItemObj>

  /** the translation namespace of the given text */
  translationNameSpace?: i18n_NS
}

const ButtonList: FC<ButtonListProps> = ({ items, translationNameSpace }) => {
  const buttons = items.map((item, index) => {
    const { textLines, a11yHintText } = item

    // Handle case of a single string passed in rather than the text line objects
    const updatedTextLines = _.isArray(textLines) ? textLines : [{ text: textLines }]

    const buttonItems: Array<WideButtonTextItem> = []

    updatedTextLines.forEach((textObj, idx) => {
      buttonItems[idx] = { text: textObj.text, isBold: textObj.isBold }
    })

    return <WideButton key={index} listOfText={buttonItems} a11yHint={a11yHintText || ''} {...item} />
  })

  const t = useTranslation(translationNameSpace)
  return (
    <Box borderTopWidth={1} borderStyle="solid" borderColor="primary">
      <Box backgroundColor={'buttonList'}>{buttons}</Box>
    </Box>
  )
}

export default ButtonList
