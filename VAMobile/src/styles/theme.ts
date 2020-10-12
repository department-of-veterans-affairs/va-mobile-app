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
	TableHeaderLabel: string
	TableFooterLabel: string
	MobileBodyLink: string
}

export type VATheme = {
	colors: {
		background: string
		border: string
		icon: VAIconColors
		text: VATextColors
		ctaButton: {
			background: string
			text: string
		}
		control: {
			tintColor: string
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
