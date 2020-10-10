import { View, ViewProps } from 'react-native'
import React, { FC, ReactNode } from 'react'

import _ from 'underscore'

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
	width?: string
	height?: string
	flexDirection?: 'column' | 'row'
	textAlign?: 'center' | 'left' | 'right'
}

const generateBoxStyles = (s: 'margin' | 'padding', a?: number, t?: number, l?: number, r?: number, b?: number, x?: number | 'auto', y?: number): { [key: string]: string } => {
	const styles: { [key: string]: string } = {}
	if (_.isFinite(a)) {
		styles[s] = `${a}px`
	}
	if (_.isFinite(x)) {
		styles[`${s}Left`] = `${x}px`
		styles[`${s}Right`] = `${x}px`
	} else if (x === 'auto') {
		styles[`${s}Left`] = 'auto'
		styles[`${s}Right`] = 'auto'
	}
	if (_.isFinite(y)) {
		styles[`${s}Top`] = `${y}px`
		styles[`${s}Bottom`] = `${y}px`
	}
	if (_.isFinite(t)) {
		styles[`${s}Top`] = `${t}px`
	}
	if (_.isFinite(r)) {
		styles[`${s}Right`] = `${r}px`
	}
	if (_.isFinite(b)) {
		styles[`${s}Bottom`] = `${b}px`
	}
	if (_.isFinite(l)) {
		styles[`${s}Left`] = `${l}px`
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

const Box: FC<BoxProps> = (props) => {
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
		justifyContent: props.justifyContent,
		alignItems: props.alignItems,
		width: props.width,
		height: props.height,
		flex: props.flex,
		flexDirection: props.flexDirection,
		textAlign: props.textAlign,
		overflow: props.overflow,
		...mStyles,
		...pStyles,
	}

	return <View style={styles}>{props.children}</View>
}

export default Box
