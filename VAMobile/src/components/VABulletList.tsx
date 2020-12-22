import React, { FC } from 'react'

import _ from 'underscore'

import { Linking } from 'react-native'
import { VATextColors } from '../styles/theme'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import TextView, { FontVariant } from './TextView'
import VAIcon from './VAIcon'

/**
 * Props for item in {@link listOfText}
 */
export type VABulletListText = {
  /** string to display */
  text: string

  /** optional parameter that if exists, will make the text a link */
  linkToRedirect?: string

  /** optional parameter to display given bolded text after main text */
  boldedText?: string

  /** optional variant for text, defaults to regular */
  variant?: FontVariant

  /** optional color */
  color?: keyof VATextColors
}

/**
 * Props for {@link VABulletList}
 */
export type VABulletListProps = {
  /** list of text to display in a bulleted list*/
  listOfText: Array<string | VABulletListText>
}

/**
 * Displays the list of text as a bulleted list
 */
const VABulletList: FC<VABulletListProps> = ({ listOfText }) => {
  const theme = useTheme()

  const getUpdatedListOfText = (): Array<VABulletListText> => {
    if (_.isString(listOfText[0])) {
      const updatedListOfTextItem: Array<VABulletListText> = []
      _.forEach(listOfText, (text) => {
        updatedListOfTextItem.push({ text: text as string })
      })
      return updatedListOfTextItem
    }

    return listOfText as Array<VABulletListText>
  }

  const onPress = (textItem: VABulletListText): void => {
    if (textItem.linkToRedirect) {
      Linking.openURL(textItem.linkToRedirect)
    }
  }

  return (
    <Box>
      {_.map(getUpdatedListOfText(), (textItem, index) => {
        return (
          <Box display="flex" flexDirection="row" alignItems="center" key={index}>
            <Box mr={theme.dimensions.textXPadding}>
              <VAIcon name="Bullet" fill="dark" />
            </Box>
            <TextView variant={textItem.variant || 'MobileBody'} color={textItem.color || 'primary'} onPress={(): void => onPress(textItem)}>
              {textItem.text.trim()}
              {!!textItem.boldedText && <TextView variant="MobileBodyBold">{textItem.boldedText}</TextView>}
            </TextView>
          </Box>
        )
      })}
    </Box>
  )
}

export default VABulletList
