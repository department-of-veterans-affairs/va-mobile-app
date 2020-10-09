import { useFontScale } from 'utils/common'
import React, { FC, ReactNode } from 'react'

// Navigation
import Appointments_Selected from 'images/navIcon/appointments_selected.svg'
import Appointments_Unselected from 'images/navIcon/appointments_unselected.svg'
import Claims_Selected from 'images/navIcon/claims_selected.svg'
import Claims_Unselected from 'images/navIcon/claims_unselected.svg'
import Home_Selected from 'images/navIcon/home_selected.svg'
import Home_Unselected from 'images/navIcon/home_unselected.svg'
import Profile_Selected from 'images/navIcon/profile_selected.svg'
import Profile_Unselected from 'images/navIcon/profile_unselected.svg'

// Arrows
import Left_Arrow_White from 'images/chevron-left-solid.svg'
import Right_Arrow_Blue from 'images/right-arrow_blue.svg'
import Right_Arrow_Grey from 'images/right-arrow_grey.svg'
import Right_Arrow_White from 'images/right-arrow_white.svg'

export enum VA_ICON_TYPES {
	HomeActive,
	HomeInactive,
	ClaimsActive,
	ClaimsInactive,
	AppointmentsActive,
	AppointmentsInactive,
	ProfileActive,
	ProfileInactive,
	ArrowRightBlue,
	ArrowRightGrey,
	ArrowRightWhite,
	ArrowLeftWhite,
}

const VA_ICON_MAP: Record<VA_ICON_TYPES, FC> = {
	[VA_ICON_TYPES.HomeActive]: Home_Selected,
	[VA_ICON_TYPES.HomeInactive]: Home_Unselected,
	[VA_ICON_TYPES.ClaimsActive]: Claims_Selected,
	[VA_ICON_TYPES.ClaimsInactive]: Claims_Unselected,
	[VA_ICON_TYPES.AppointmentsActive]: Appointments_Selected,
	[VA_ICON_TYPES.AppointmentsInactive]: Appointments_Unselected,
	[VA_ICON_TYPES.ProfileActive]: Profile_Selected,
	[VA_ICON_TYPES.ProfileInactive]: Profile_Unselected,
	[VA_ICON_TYPES.ArrowRightBlue]: Right_Arrow_Blue,
	[VA_ICON_TYPES.ArrowRightGrey]: Right_Arrow_Grey,
	[VA_ICON_TYPES.ArrowRightWhite]: Right_Arrow_White,
	[VA_ICON_TYPES.ArrowLeftWhite]: Left_Arrow_White,
}

/**
 *  Props that need to be passed in to {@link VAIcon}
 *  name - enum name of the icon to use {@link VA_ICON_TYPES}
 *  width - optional number use to set the width; otherwise defaults to svg's width
 *  height - optional number use to set the height; otherwise defaults to svg's height
 *  id - optional string use to set the attribute id on the component
 */
export type VAIconProps = {
	name: VA_ICON_TYPES
	width?: number
	height?: number
	id?: string
}

/**
 * Reusable component to display svgs
 *
 * @returns VAIcon component
 */
const VAIcon: FC<VAIconProps> = ({ name, width, height, id }: VAIconProps) => {
	const fs: Function = useFontScale()
	const Icon: FC = VA_ICON_MAP[name]
	let props: ReactNode = {
		id: id,
	}

	if (width) {
		props = {
			...props,
			width: fs(width),
		}
	}

	if (height) {
		props = {
			...props,
			height: fs(height),
		}
	}

	return <Icon {...props} />
}

export default VAIcon
