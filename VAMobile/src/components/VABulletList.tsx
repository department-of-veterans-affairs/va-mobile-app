import React, { FC } from 'react'

import _ from 'underscore'

import { VATextColors } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useExternalLink } from 'utils/hooks'
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
}

/**
 * Displays the list of text as a bulleted list
 */
const VABulletList: FC<VABulletListProps> = ({ listOfText }, paragraphSpacing) => {
  const launchExternalLink = useExternalLink()
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
    launchExternalLink(linkToRedirect)
  }

  return (
    <Box mb={paragraphSpacing ? theme.paragraphSpacing.spacing20FontSize : undefined}>
      {_.map(getUpdatedListOfText(), (textItem, index) => {
        const { variant, color, linkToRedirect, text, boldedTextPrefix, boldedText, a11yLabel } = textItem

        const textViewProps: TextViewProps = {
          variant: variant || 'MobileBody',
          color: color || 'bodyText',
          onPress: linkToRedirect ? async (): Promise<void> => onPress(linkToRedirect) : undefined,
          flexWrap: 'wrap',
          flex: 1,
        }

        return (
          <Box display="flex" flexDirection="row" alignItems="flex-start" key={index} accessible={true}>
            <Box mr={20} mt={12}>
              <VAIcon name="Bullet" fill={color || 'bodyText'} height={6} width={6} />
            </Box>
            <TextView {...textViewProps} {...testIdProps(a11yLabel || text)}>
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
