import React, { FC } from 'react'

import _ from 'underscore'

import { VATextColors } from 'styles/theme'
import { useTheme } from 'utils/hooks'

import Box, { BackgroundVariant } from './Box'
import TextView, { FontVariant, TextViewProps } from './TextView'

/**
 * Props for item in {@link listOfText}
 */
export type VABulletListText = {
  /** string to display */
  text: string

  /** optional parameter to display given bolded text before main text */
  boldedTextPrefix?: string

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

  /** optional paragraph spacing */
  paragraphSpacing?: boolean

  /** optional bullet color */
  bulletColor?: BackgroundVariant
}

/**
 * Displays the list of text as a bulleted list
 */
const VABulletList: FC<VABulletListProps> = ({ listOfText, paragraphSpacing, bulletColor }) => {
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

  return (
    <Box mb={paragraphSpacing ? theme.dimensions.standardMarginBetween : undefined}>
      {_.map(getUpdatedListOfText(), (textItem, index) => {
        const { variant, color, text, boldedTextPrefix, boldedText, a11yLabel } = textItem

        const textViewProps: TextViewProps = {
          variant: variant || 'MobileBody',
          color: color || 'bodyText',
          flexWrap: 'wrap',
          flex: 1,
        }

        return (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="flex-start"
            key={index}
            accessible={true}
            accessibilityRole="text">
            <Box mr={20} mt={12}>
              <Box backgroundColor={bulletColor || 'bullet'} height={6} width={6} />
            </Box>
            {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
            <TextView {...textViewProps} accessibilityLabel={a11yLabel}>
              {!!boldedTextPrefix && <TextView variant="MobileBodyBold">{boldedTextPrefix}</TextView>}
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
