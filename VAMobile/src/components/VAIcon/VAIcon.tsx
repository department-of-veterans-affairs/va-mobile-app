import { SvgProps } from 'react-native-svg'
import { isFinite } from 'underscore'
import { useFontScale } from 'utils/common'
import React, { FC } from 'react'

// Navigation
import Appointments from './svgs/navIcon/appointments.svg'
import Claims from './svgs/navIcon/claims.svg'
import Home from './svgs/navIcon/home.svg'

import Profile from './svgs/navIcon/profile.svg'

// Arrows
import ArrowLeft from './svgs/chevron-left.svg'
import ArrowRight from './svgs/chevron-right.svg'

const VA_ICON_MAP = {
	Home,
	Claims,
	Appointments,
	Profile,
	ArrowLeft,
	ArrowRight,
}

/**
 *  Props that need to be passed in to {@link VAIcon}
 *  name - enum name of the icon to use {@link VA_ICON_TYPES}
 *  width - optional number use to set the width; otherwise defaults to svg's width
 *  height - optional number use to set the height; otherwise defaults to svg's height
 *  id - optional string use to set the attribute id on the component
 */
export type VAIconProps = SvgProps & {
	name: keyof typeof VA_ICON_MAP
	width?: number
	height?: number
}

/**
 * Reusable component to display svgs
 *
 * @returns VAIcon component
 */
const VAIcon: FC<VAIconProps> = (props: VAIconProps) => {
	props = { ...props }
	const fs: Function = useFontScale()
	const { name, width, height } = props
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
	return <Icon {...props} />
}

export default VAIcon
