export type VATextColors = {
	navBar: string
	primary: string
	primaryContrast: string
	secondary: string
	link: string
	error: string
}

export type VAIconColors = {
	link: string
	nav: string
	disclosure: string
	success: string
	error: string
	active: string
	inactive: string
	contrast: string
}

export type VATypographyThemeVariants = {
	BitterBoldHeading: string
	MobileBody: string
	MobileBodyBold: string
	TableHeaderBold: string
	TableHeaderLabel: string
	TableFooterLabel: string
	MobileBodyLink: string
}

export type VABackgroundColors = {
	main: string
	textBox: string
	buttonList: string
}

export type VABorderColors = {
	primary: string
}

export type VATheme = {
	colors: {
		background: VABackgroundColors
		border: VABorderColors
		icon: VAIconColors
		text: VATextColors
		ctaButton: {
			background: string
			text: string
		}
		control: {
			tintColor: string
			switchOnTrack: string
			switchOffTrack: string
			switchOnThumb: string
			switchOffThumb: string
		}
	}
	dimensions: {
		borderWidth: string
	}
	fontFace: {
		regular: string
		bold: string
		altBold: string
	}
	typography: VATypographyThemeVariants
}
