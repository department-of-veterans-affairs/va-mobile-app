import { FC } from 'react'
import React from 'react'
import _ from 'underscore'

import { i18n_NS } from 'constants/namespaces'
import { useTranslation } from 'utils/hooks'
import Box from './Box'
import WideButton, { WideButtonProps } from './WideButton'

/**
 * Signifies each item in the array of text IDS in {@link ButtonListItemObj}
 */
export type textIDObj = {
  /** string signifying the translation id of the text */
  textID: string

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

          const resultingTexts: Array<string> = []

          updatedTextIDs.forEach((textIDObj, textIDIndex) => {
            if (textIDObj.fieldObj) {
              resultingTexts[textIDIndex] = t(textIDObj.textID, textIDObj.fieldObj)
            } else {
              resultingTexts[textIDIndex] = t(textIDObj.textID)
            }
          })

          return <WideButton key={index} listOfText={resultingTexts} a11yHint={a11yHintText || ''} {...item} />
        })}
      </Box>
    </Box>
  )
}

export default ButtonList
