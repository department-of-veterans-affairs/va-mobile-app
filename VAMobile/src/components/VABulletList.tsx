import React, { FC } from 'react'

import _ from 'underscore'

import { Linking } from 'react-native'
import { VATextColors } from '../styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import TextView, { FontVariant, TextViewProps } from './TextView'
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

  /** optional accessibility label for text */
  a11yLabel?: string
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

  const onPress = async (linkToRedirect: string): Promise<void> => {
    await Linking.openURL(linkToRedirect)
  }

  return (
    <Box>
      {_.map(getUpdatedListOfText(), (textItem, index) => {
        const { variant, color, linkToRedirect, text, boldedText, a11yLabel } = textItem

        const textViewProps: TextViewProps = {
          variant: variant || 'MobileBody',
          color: color || 'primary',
          onPress: linkToRedirect ? async (): Promise<void> => onPress(linkToRedirect) : undefined,
        }

        return (
          <Box display="flex" flexDirection="row" alignItems="flex-start" key={index}>
            <Box mr={theme.dimensions.textXPadding} mt={theme.dimensions.bulletMargin}>
              <VAIcon name="Bullet" fill="dark" />
            </Box>
            <TextView {...textViewProps} {...testIdProps(a11yLabel || text)}>
              {text.trim()}
              {!!boldedText && <TextView variant="MobileBodyBold">{boldedText}</TextView>}
            </TextView>
          </Box>
        )
      })}
    </Box>
  )
}

export default VABulletList
