import { VABackgroundColors, VATheme } from 'styles/theme'
import { ViewProps } from 'react-native'
import React, { FC, ReactNode } from 'react'
import _ from 'underscore'
import styled from 'styled-components/native'

import { themeFn } from 'utils/theme'

type BackgroundVariant = keyof VABackgroundColors

export type BoxProps = ViewProps & {
	m?: number
	mt?: number
	mr?: number
	mb?: number
	ml?: number
	mx?: number | 'auto'
	my?: number
	p?: number
	pt?: number
	pr?: number
	pb?: number
	pl?: number
	px?: number
	py?: number
	top?: string | number
	left?: string | number
	right?: string | number
	bottom?: string | number
	position?: 'relative' | 'absolute'
	display?: 'flex' | 'none'
	flex?: number
	overflow?: 'hidden' | 'visible' | 'scroll'
	justifyContent?: 'center' | 'flex-start' | 'flex-end'
	alignItems?: 'center' | 'flex-start' | 'flex-end'
	children?: ReactNode
	width?: number | string
	height?: number | string
	flexDirection?: 'column' | 'row'
	textAlign?: 'center' | 'left' | 'right'
	backgroundColor?: BackgroundVariant
}

const generateBoxStyles = (s: 'margin' | 'padding', a?: number, t?: number, l?: number, r?: number, b?: number, x?: number | 'auto', y?: number): { [key: string]: string } => {
	const styles: { [key: string]: string } = {}
	if (_.isFinite(a)) {
		styles[s] = `${a}px`
	}
	if (_.isFinite(x)) {
		styles[`${s}-left`] = `${x}px`
		styles[`${s}-right`] = `${x}px`
	} else if (x === 'auto') {
		styles[`${s}-left`] = 'auto'
		styles[`${s}-right`] = 'auto'
	}
	if (_.isFinite(y)) {
		styles[`${s}-top`] = `${y}px`
		styles[`${s}-bottom`] = `${y}px`
	}
	if (_.isFinite(t)) {
		styles[`${s}-top`] = `${t}px`
	}
	if (_.isFinite(r)) {
		styles[`${s}-right`] = `${r}px`
	}
	if (_.isFinite(b)) {
		styles[`${s}-Bottom`] = `${b}px`
	}
	if (_.isFinite(l)) {
		styles[`${s}-left`] = `${l}px`
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

const getBackgoundColor = (theme: VATheme, bgVariant: BackgroundVariant | undefined): string => {
	return bgVariant ? theme.colors.background[bgVariant] : 'transparent'
}

export const createBoxStyles = (_theme: VATheme, props: BoxProps): string => {
	const { m, mt, ml, mr, mb, mx, my } = props
	const mStyles = generateBoxStyles('margin', m, mt, ml, mr, mb, mx, my)
	const { p, pt, pl, pr, pb, px, py } = props
	const pStyles = generateBoxStyles('padding', p, pt, pl, pr, pb, px, py)

	const styles = {
		position: props.position,
		top: toDimen(props.top),
		left: toDimen(props.left),
		right: toDimen(props.right),
		bottom: toDimen(props.bottom),
		display: props.display,
		'justify-content': props.justifyContent,
		'align-items': props.alignItems,
		width: typeof props.width === 'number' ? `${props.width}px` : props.width,
		height: typeof props.height === 'number' ? `${props.height}px` : props.height,
		flex: props.flex,
		'flex-direction': props.flexDirection,
		'text-align': props.textAlign,
		overflow: props.overflow,
		...mStyles,
		...pStyles,
		'background-color': getBackgoundColor(_theme, props.backgroundColor),
	}

	const str = _.map(styles, (v, k) => {
		if (v === undefined) {
			return undefined
		}
		return `${k}:${v}`
	})
		.filter((line) => line !== undefined)
		.join(';\n')

	return str
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
