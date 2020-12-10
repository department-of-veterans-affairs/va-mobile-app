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

  /** whether to center the text */
  isCentered?: boolean
}
