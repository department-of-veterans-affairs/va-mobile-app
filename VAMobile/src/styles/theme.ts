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
	h3: string
	body1: string
	body1Bold: string
	body2: string
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

type FontFamily = 'SourceSansPro-Regular' | 'SourceSansPro-Bold' | 'Bitter-Bold' | 'System'

const primaryTextColor = '#323A45'

const buildFont = (family: FontFamily, fontSize: number, lineHeight?: number): string => {
	const styles = [`color:${primaryTextColor}`, `font-family:"${family}"`, `font-size:${fontSize}px`]
	if (lineHeight) {
		styles.push(`line-height: ${lineHeight}px`)
	}
	return styles.join(';\n')
}

const theme: VATheme = {
	colors: {
		background: '#F2F2F7',
		border: '#b8b8bb',
		icon: {
			link: '#0071BC',
			nav: '#004795',
			disclosure: '#b8b8bb',
			success: '#2E8540',
			error: '#CD2026',
			active: '#003E73',
			inactive: '#0071BC',
			contrast: '#FFFFFF',
		},
		text: {
			navBar: '#FFFFFF',
			primary: primaryTextColor,
			primaryContrast: '#FFFFFF',
			secondary: '#000000',
			error: '#CD2026',
			link: '#004795',
		},
		control: {
			tintColor: '#0071BC',
		},
		ctaButton: {
			background: '#b51c08',
			text: '#FFFFFF',
		},
	},

	dimensions: {
		borderWidth: '1px',
	},

	fontFace: {
		regular: 'SourceSansPro-Regular',
		bold: 'SourceSansPro-Bold',
		altBold: 'Bitter-Bold',
	},

	typography: {
		h3: buildFont('Bitter-Bold', 20, 26),
		body1: buildFont('SourceSansPro-Regular', 17, 20),
		body1Bold: buildFont('SourceSansPro-Bold', 17, 20),
		body2: buildFont('SourceSansPro-Regular', 16, 19),
	},
}

export default theme
