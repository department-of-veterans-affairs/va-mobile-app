import { LabelTagTypes } from '../LabelTag'
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
    labelType: LabelTagTypes
  }
  /*optional a11y label*/
  a11yLabel?: string

  /** set margin top of this component*/
  mt?: number | string // same as in Box.tsx

  /** set margin bottom of this component*/
  mb?: number | string // same as in Box.tsx
}

export type InlineText = {
  /** text to be displayed in left column */
  leftTextProps: TextLine

  /** text to be displayed in right column */
  rightTextProps?: TextLine
}
