import { FlexAlignType, View, ViewProps } from 'react-native'
import { VAAlertBoxColors, VABackgroundColors, VABorderColors, VAButtonBackgroundColors, VAButtonBorderColors, VATheme } from 'styles/theme'
import React, { FC, ReactNode } from 'react'
import _ from 'underscore'
import styled from 'styled-components'

import { themeFn } from 'utils/theme'

type VABackgroundColorsVariant = keyof VABackgroundColors
type VAAlertBoxColorsVariant = keyof VAAlertBoxColors
type VAButtonBackgroundColorsVariant = keyof VAButtonBackgroundColors
export type BackgroundVariant = VABackgroundColorsVariant | VAAlertBoxColorsVariant | VAButtonBackgroundColorsVariant

type VABorderColorsVariant = keyof VABorderColors
type VAButtonBorderColorsVariant = keyof VAButtonBorderColors
export type BorderColorVariant = VABorderColorsVariant | VAButtonBackgroundColorsVariant
export type BorderStyles = 'none' | 'dotted' | 'solid' | 'dashed'
export type BorderWidths = 'default' | number

// assume strings are coming back as `<number>px`
type NumOrStrPx = number | string

export type BoxProps = ViewProps & {
  /** set margin of this component*/
  m?: NumOrStrPx
  /** set margin top of this component*/
  mt?: NumOrStrPx
  /** set margin right of this component*/
  mr?: NumOrStrPx
  /** set margin bottom of this component*/
  mb?: NumOrStrPx
  /** set margin left of this component*/
  ml?: NumOrStrPx
  /** set margin right and left of this component*/
  mx?: NumOrStrPx | 'auto'
  /** set margin top and bottom of this component*/
  my?: NumOrStrPx
  /** set padding of this component*/
  p?: NumOrStrPx
  /** set padding top of this component*/
  pt?: NumOrStrPx
  /** set padding right of this component*/
  pr?: NumOrStrPx
  /** set padding bottom of this component*/
  pb?: NumOrStrPx
  /** set padding left of this component*/
  pl?: NumOrStrPx
  /** set padding right and left of this component*/
  px?: NumOrStrPx
  /** set padding top and bottom of this component*/
  py?: NumOrStrPx
  /** sets the number of logical pixels to offset the top edge of this component*/
  top?: string | number
  /** sets the number of logical pixels to offset the left edge of this component*/
  left?: string | number
  /** sets the number of logical pixels to offset the right edge of this component*/
  right?: string | number
  /** sets the number of logical pixels to offset the bottom edge of this component*/
  bottom?: string | number
  /** sets the positioning to relative or absolute of this component*/
  position?: 'relative' | 'absolute'
  /**sets the display type of this component*/
  display?: 'flex' | 'none'
  /**sets the flex property of this component*/
  flex?: number
  /**describes how any space within a container should be distributed among its children along the main axis*/
  flexGrow?: number
  /**flexShrink describes how to shrink children along the main axis in the case in which the total size of the children overflows the size of the container on the main axis*/
  flexShrink?: number
  /**controls whether children can wrap around after they hit the end of a flex container*/
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  /**controls which directions children of a container go*/
  flexDirection?: 'column' | 'row'
  /**controls how children are measured and displayed*/
  overflow?: 'hidden' | 'visible' | 'scroll'
  /**aligns children in the main direction*/
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between'
  /**aligns children in the cross direction*/
  alignItems?: 'center' | 'flex-start' | 'flex-end'
  /**controls how a child aligns in the cross direction, overriding the alignItems of the parent*/
  alignSelf?: 'auto' | FlexAlignType
  /** react nodes passed to the component*/
  children?: ReactNode
  /** sets the width of this component*/
  width?: number | string
  /** sets the min width of this component*/
  minWidth?: number | string
  /** sets the height of this component*/
  height?: number | string
  /** sets the min height of this component*/
  minHeight?: number | string
  /**alings the text of this component*/
  textAlign?: 'center' | 'left' | 'right'
  /** sets the background color of this component*/
  backgroundColor?: BackgroundVariant
  /** sets the opacity of this component*/
  opacity?: number
  /** sets the border width of this component*/
  borderWidth?: BorderWidths
  /** sets the border color of this component*/
  borderColor?: BorderColorVariant
  /** sets the border style of this component*/
  borderStyle?: BorderStyles
  /** sets the bottom border's width of this component*/
  borderBottomWidth?: BorderWidths
  /** sets the bottom border's color of this component*/
  borderBottomColor?: BorderColorVariant
  /** sets the top border's width of this component*/
  borderTopWidth?: BorderWidths
  /** sets the top border's color of this component*/
  borderTopColor?: BorderColorVariant
  /** sets the right border's width of this component*/
  borderRightWidth?: BorderWidths
  /** sets the right border's color of this component*/
  borderRightColor?: BorderColorVariant
  /** sets the left border's width of this component*/
  borderLeftWidth?: BorderWidths
  /** sets the left border's color of this component*/
  borderLeftColor?: BorderColorVariant
  /** sets the border's radius of this component*/
  borderRadius?: number | string
}

const toDimen = (val?: string | number): string | undefined => {
  if (val === undefined || val === null) {
    return
  }
  if (_.isFinite(val)) {
    return `${val}px`
  }
  return `${val}`
}

const generateBoxStyles = (
  s: 'margin' | 'padding',
  a?: NumOrStrPx,
  t?: NumOrStrPx,
  l?: NumOrStrPx,
  r?: NumOrStrPx,
  b?: NumOrStrPx,
  x?: NumOrStrPx | 'auto',
  y?: NumOrStrPx,
): { [key: string]: string | undefined } => {
  const styles: { [key: string]: string | undefined } = {}

  styles[`${s}-top`] = toDimen(t)
  styles[`${s}-right`] = toDimen(r)
  styles[`${s}-bottom`] = toDimen(b)
  styles[`${s}-left`] = toDimen(l)

  if (a) {
    styles[s] = toDimen(a)
  }

  if (x) {
    const xDimen = toDimen(x)
    if (xDimen === 'auto') {
      styles[`${s}-left`] = 'auto'
      styles[`${s}-right`] = 'auto'
    } else {
      styles[`${s}-left`] = xDimen
      styles[`${s}-right`] = xDimen
    }
  }

  if (y) {
    styles[`${s}-top`] = toDimen(y)
    styles[`${s}-bottom`] = toDimen(y)
  }

  return styles
}

const getBackgroundColor = (theme: VATheme, bgVariant: BackgroundVariant | undefined): string => {
  if (!bgVariant) {
    return 'transparent'
  }
  return (
    theme.colors.background[bgVariant as VABackgroundColorsVariant] ||
    theme.colors.alertBox[bgVariant as VAAlertBoxColorsVariant] ||
    theme.colors.buttonBackground[bgVariant as VAButtonBackgroundColorsVariant]
  )
}

const generateBorderStyles = (
  theme: VATheme,
  direction: '' | 'top' | 'bottom' | 'left' | 'right',
  width?: BorderWidths,
  style?: BorderStyles,
  color?: BorderColorVariant,
): { [key: string]: string } => {
  const styles: { [key: string]: string } = {}
  const dir = direction !== '' ? `-${direction}` : ''

  if (width) {
    styles[`border${dir}-width`] = _.isFinite(width) ? `${width}px` : `${theme.dimensions.borderWidth}px`
  }

  if (style) {
    styles['border-style'] = style
  }

  if (color) {
    styles[`border${dir}-color`] = theme.colors.border[color as VABorderColorsVariant] || theme.colors.buttonBorder[color as VAButtonBorderColorsVariant]
  }
  return styles
}

export const createBoxStyles = (theme: VATheme, props: BoxProps): string => {
  const { m, mt, ml, mr, mb, mx, my } = props
  const mStyles = generateBoxStyles('margin', m, mt, ml, mr, mb, mx, my)
  const { p, pt, pl, pr, pb, px, py } = props
  const pStyles = generateBoxStyles('padding', p, pt, pl, pr, pb, px, py)

  const { borderWidth, borderStyle, borderColor } = props
  const borderStyles = generateBorderStyles(theme, '', borderWidth, borderStyle, borderColor)
  const { borderTopWidth, borderTopColor } = props
  const btStyles = generateBorderStyles(theme, 'top', borderTopWidth, borderStyle, borderTopColor)
  const { borderBottomWidth, borderBottomColor } = props
  const bbStyles = generateBorderStyles(theme, 'bottom', borderBottomWidth, borderStyle, borderBottomColor)
  const { borderLeftWidth, borderLeftColor } = props
  const blStyles = generateBorderStyles(theme, 'left', borderLeftWidth, borderStyle, borderLeftColor)
  const { borderRightWidth, borderRightColor } = props
  const brStyles = generateBorderStyles(theme, 'right', borderRightWidth, borderStyle, borderRightColor)

  const styles = {
    position: props.position,
    top: toDimen(props.top),
    left: toDimen(props.left),
    right: toDimen(props.right),
    bottom: toDimen(props.bottom),
    display: props.display,
    'justify-content': props.justifyContent,
    'align-items': props.alignItems,
    'align-self': props.alignSelf,
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    minWidth: typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    minHeight: typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight,
    flex: props.flex,
    'flex-direction': props.flexDirection,
    'flex-shrink': props.flexShrink,
    'flex-grow': props.flexGrow,
    'flex-wrap': props.flexWrap,
    'text-align': props.textAlign,
    overflow: props.overflow,
    ...mStyles,
    ...pStyles,
    'background-color': getBackgroundColor(theme, props.backgroundColor),
    opacity: props.opacity,
    ...borderStyles,
    ...btStyles,
    ...bbStyles,
    ...blStyles,
    ...brStyles,
    'border-radius': typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius,
  }

  return _.map(styles, (v, k) => {
    if (v === undefined) {
      return undefined
    }
    return `${k}:${v}`
  })
    .filter((line) => line !== undefined)
    .join(';\n')
}

const StyledBox = styled(View)`
  ${themeFn<BoxProps>((theme, props) => createBoxStyles(theme, props))};
`
/**
 * A common component for layout. It conforms to the convention of [m] [my] [mx] [mt] [mb] [ml] [mr] for specifying margins. It also accepts dimensions for padding in the same form.
 *
 * @returns TextView component
 */
const Box: FC<BoxProps> = (props) => {
  return <StyledBox {...props} />
}

export default Box
