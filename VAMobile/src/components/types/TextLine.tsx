import { BackgroundVariant } from '../Box'
import { ColorVariant, FontVariant } from '../TextView'
import { VATextColors, VATypographyThemeVariants } from 'styles/theme'

/**
 * Represents a line of text and associated properties
 */
export type TextLine = {
  /** string to display */
  text: string

  /** sets the variant of the text, if not set defaults to MobileBody */
  variant?: keyof VATypographyThemeVariants

  /** sets the text to the specified color, if not specified defaults to primary */
  color?: keyof VATextColors

  /** alignment of the text */
  textAlign?: 'center' | 'left' | 'right'

  /** sets the text to be a tag */
  textTag?: {
    /** optional background color for tag */
    backgroundColor?: BackgroundVariant

    /** optional text color for tag */
    color?: ColorVariant

    /** optional variant for tag text */
    variant?: FontVariant
  }
}

export type InlineText = {
  /** text to be displayed in left column */
  leftTextProps: TextLine

  /** text to be displayed in right column */
  rightTextProps?: TextLine
}
