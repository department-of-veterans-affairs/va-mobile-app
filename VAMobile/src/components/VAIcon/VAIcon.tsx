import { SvgProps } from 'react-native-svg'
import { isFinite } from 'underscore'
import React, { FC } from 'react'

import { VAIconColors } from 'styles/theme'
import { useFontScale } from 'utils/common'
import { useTheme } from 'utils/hooks'

import { Box, BoxProps } from 'components'
// Navigation
import Appointments from './svgs/navIcon/appointments.svg'
import Claims from './svgs/navIcon/claims.svg'
import Home from './svgs/navIcon/home.svg'

import Profile from './svgs/navIcon/profile.svg'

// Arrows
import ArrowLeft from './svgs/chevron-left.svg'
import ArrowRight from './svgs/chevron-right.svg'

// forces icons

import Airforce from './svgs/dodBranch/air-force.svg'
import Army from './svgs/dodBranch/army.svg'
import CoastGuard from './svgs/dodBranch/coast-guard.svg'
import Marines from './svgs/dodBranch/marine.svg'
import Navy from './svgs/dodBranch/navy.svg'

// Webview
import WebviewBack from './svgs/webview/chevron-left-solid.svg'
import WebviewForward from './svgs/webview/chevron-right-solid.svg'
import WebviewOpen from './svgs/webview/external-link-alt-solid.svg'
import WebviewRefresh from './svgs/webview/redo-solid.svg'

// Misc
import Lock from './svgs/webview/lock-solid.svg'

export const VA_ICON_MAP = {
	Home,
	Claims,
	Appointments,
	Profile,
	ArrowLeft,
	ArrowRight,
	Airforce,
	Army,
	CoastGuard,
	Marines,
	Navy,
	WebviewBack,
	WebviewForward,
	WebviewOpen,
	WebviewRefresh,
	Lock,
}

/**
 *  Props that need to be passed in to {@link VAIcon}
 */
export type VAIconProps = BoxProps & {
	/**  enum name of the icon to use {@link VA_ICON_TYPES} **/
	name: keyof typeof VA_ICON_MAP

	/** Fill color for the icon */
	fill?: keyof VAIconColors | string

	/** Stroke color of the icon */
	stroke?: keyof VAIconColors | string

	/**  optional number use to set the width; otherwise defaults to svg's width */
	width?: number

	/**  optional number use to set the height; otherwise defaults to svg's height */
	height?: number
}

/**
 * Reusable component to display svgs
 *
 * @returns VAIcon component
 */
const VAIcon: FC<VAIconProps> = (props: VAIconProps) => {
	const theme = useTheme()
	props = { ...props }
	const fs: Function = useFontScale()
	const { name, width, height, fill, stroke } = props

	if (fill) {
		props.fill = theme.colors.icon[fill as keyof VAIconColors] || fill
	}

	if (stroke) {
		props.stroke = theme.colors.icon[stroke as keyof VAIconColors] || stroke
	}

	const Icon: FC<SvgProps> | undefined = VA_ICON_MAP[name]
	if (!Icon) {
		return <></>
	}
	delete props.name

	if (isFinite(width)) {
		props.width = fs(width)
	}

	if (isFinite(height)) {
		props.height = fs(height)
	}
	return (
		<Box {...props}>
			<Icon {...props} />
		</Box>
	)
}

export default VAIcon
