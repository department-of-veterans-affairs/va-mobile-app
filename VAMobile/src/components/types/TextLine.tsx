import { VATextColors } from 'styles/theme'

/**
 * Represents a line of text and associated properties
 */
export type TextLine = {
  /** string to display */
  text: string

  /** if true makes the line bold */
  isBold?: boolean

  /** sets the text to the specified color, if not specified defaults to primary */
  color?: keyof VATextColors

  /** alignment of the text */
  textAlign?: 'center' | 'left' | 'right'
}
