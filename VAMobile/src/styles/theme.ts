import { VAColors } from './colors'

const theme = {
	primaryBlack: VAColors.grayDark,
	white: VAColors.white,
	gray: '#b8b8bb',
	background: '#F2F2F7',
	textColor: VAColors.grayDark,
	activeBlue: VAColors.primaryDarker,
	inactiveBlue: VAColors.primary,
	borderWidth: '1px',
}

export type ThemeType = {
	theme: {
		primaryBlack: string
		white: string
		gray: string
		background: string
		textColor: string
		activeBlue: string
		inactiveBlue: string
		borderWidth: string
	}
}

export default theme
