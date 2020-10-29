import { FlexAlignType, ViewProps } from 'react-native'
import { VABackgroundColors, VABorderColors, VATheme } from 'styles/theme'
import React, { FC, ReactNode } from 'react'
import _ from 'underscore'
import styled from 'styled-components/native'

import { themeFn } from 'utils/theme'

type BackgroundVariant = keyof VABackgroundColors

type BorderColorVariant = keyof VABorderColors
type BorderStyles = 'none' | 'dotted' | 'solid' | 'dashed'
type BorderWidths = 'default' | number

// assume strings are coming back as `<number>px`
type NumOrStrPx = number | string

export type BoxProps = ViewProps & {
  m?: NumOrStrPx
  mt?: NumOrStrPx
  mr?: NumOrStrPx
  mb?: NumOrStrPx
  ml?: NumOrStrPx
  mx?: NumOrStrPx | 'auto'
  my?: NumOrStrPx
  p?: NumOrStrPx
  pt?: NumOrStrPx
  pr?: NumOrStrPx
  pb?: NumOrStrPx
  pl?: NumOrStrPx
  px?: NumOrStrPx
  py?: NumOrStrPx
  top?: string | number
  left?: string | number
  right?: string | number
  bottom?: string | number
  position?: 'relative' | 'absolute'
  display?: 'flex' | 'none'
  flex?: number
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  overflow?: 'hidden' | 'visible' | 'scroll'
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between'
  alignItems?: 'center' | 'flex-start' | 'flex-end'
  alignSelf?: 'auto' | FlexAlignType
  children?: ReactNode
  width?: number | string
  height?: number | string
  minHeight?: number | string
  flexDirection?: 'column' | 'row'
  textAlign?: 'center' | 'left' | 'right'
  backgroundColor?: BackgroundVariant
  borderWidth?: BorderWidths
  borderColor?: BorderColorVariant
  borderStyle?: BorderStyles
  borderBottomWidth?: BorderWidths
  borderBottomColor?: BorderColorVariant
  borderTopWidth?: BorderWidths
  borderTopColor?: BorderColorVariant
  borderRightWidth?: BorderWidths
  borderRightColor?: BorderColorVariant
  borderLeftWidth?: BorderWidths
  borderLeftColor?: BorderColorVariant
  borderRadius?: number | string
}

const getPixels = (val?: NumOrStrPx): string => {
  return typeof val === 'string' ? val : `${val}px`
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
): { [key: string]: string } => {
  const styles: { [key: string]: string } = {}
  if (_.isFinite(a)) {
    styles[s] = getPixels(a)
  }
  if (_.isFinite(x)) {
    styles[`${s}-left`] = getPixels(x)
    styles[`${s}-right`] = getPixels(x)
  } else if (x === 'auto') {
    styles[`${s}-left`] = 'auto'
    styles[`${s}-right`] = 'auto'
  }
  if (_.isFinite(y)) {
    styles[`${s}-top`] = getPixels(y)
    styles[`${s}-bottom`] = getPixels(y)
  }
  if (_.isFinite(t)) {
    styles[`${s}-top`] = getPixels(t)
  }
  if (_.isFinite(r)) {
    styles[`${s}-right`] = getPixels(r)
  }
  if (_.isFinite(b)) {
    styles[`${s}-Bottom`] = getPixels(b)
  }
  if (_.isFinite(l)) {
    styles[`${s}-left`] = getPixels(l)
  }
  return styles
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

const getBackgroundColor = (theme: VATheme, bgVariant: BackgroundVariant | undefined): string => {
  return bgVariant ? theme.colors.background[bgVariant] : 'transparent'
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
    styles[`border${dir}-width`] = _.isFinite(width) ? `${width}px` : theme.dimensions.borderWidth
  }

  if (style) {
    styles['border-style'] = style
  }

  if (color) {
    styles[`border${dir}-color`] = theme.colors.border[color]
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
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    minHeight: typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight,
    flex: props.flex,
    'flex-direction': props.flexDirection,
    'flex-wrap': props.flexWrap,
    'text-align': props.textAlign,
    overflow: props.overflow,
    ...mStyles,
    ...pStyles,
    'background-color': getBackgroundColor(theme, props.backgroundColor),
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

const StyledBox = styled.View`
  ${themeFn<BoxProps>((theme, props) => createBoxStyles(theme, props))};
`
/**
 * Text is an element to quickly style text
 *
 * @returns TextView component
 */
const Box: FC<BoxProps> = (props) => {
  return <StyledBox {...props} />
}

export default Box
