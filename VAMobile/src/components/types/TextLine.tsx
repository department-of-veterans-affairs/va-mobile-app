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

  isTextTag?: boolean
}
