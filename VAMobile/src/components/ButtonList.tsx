import { FC } from 'react'
import React from 'react'
import _ from 'underscore'

import { i18n_NS } from 'constants/namespaces'
import { useTranslation } from 'utils/hooks'
import Box from './Box'
import WideButton, { WideButtonProps, WideButtonTextItem } from './WideButton'

/**
 * Signifies item that textID in {@link textIDObj} can be
 */
export type textIDField = {
  /** translation id of string */
  id: string

  /** if true makes the line bold */
  isBold?: boolean
}

/**
 * Signifies each item in the array of text IDS in {@link ButtonListItemObj}
 */
export type textIDObj = {
  /** string or textIDField signifying the translation id of the text */
  textID: string | textIDField

  /** object passed into translation call when there are dynamic fields to be displayed */
  fieldObj?: { [key: string]: string }
}

/**
 * Signifies each item in the list of items in {@link ButtonListProps}
 */
export type ButtonListItemObj = {
  /** translation IDs of all text to display */
  textIDs: Array<textIDObj> | string

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
  const t = useTranslation(translationNameSpace)
  return (
    <Box borderTopWidth={1} borderStyle="solid" borderColor="primary">
      <Box backgroundColor={'buttonList'}>
        {items.map((item, index) => {
          const { textIDs, a11yHintText } = item
          const updatedTextIDs = _.isArray(textIDs) ? textIDs : [{ textID: textIDs }]

          const resultingTexts: Array<WideButtonTextItem> = []

          updatedTextIDs.forEach((textIDObj, textIDIndex) => {
            const id = typeof textIDObj.textID === 'string' ? textIDObj.textID : textIDObj.textID.id
            const isBold = typeof textIDObj.textID === 'string' ? false : textIDObj.textID.isBold

            if (textIDObj.fieldObj) {
              resultingTexts[textIDIndex] = { text: t(id, textIDObj.fieldObj), isBold }
            } else {
              resultingTexts[textIDIndex] = { text: t(id), isBold }
            }
          })

          return <WideButton key={index} listOfText={resultingTexts} a11yHint={a11yHintText || ''} {...item} />
        })}
      </Box>
    </Box>
  )
}

export default ButtonList
