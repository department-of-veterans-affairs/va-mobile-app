export type VATheme = {
	/*	primaryBlack: string
	white: string
	gray: string */
	//gray: string
	white: string
	background: string
	borderColor: string
	text: {
		titleBar: string
		primary: string
	}
	ctaButton: {
		background: string
		contrastText: string
	}
	primaryColor: {
		active: string
		inactive: string
		contrastText: string
	}
	fontFace: {
		regular: string
		bold: string
		altBold: string
	}
	typography: {
		h1: string
		h2: string
		h3: string
		body1: string
		body2: string
	}

	borderWidth: string
}

type FontFamily = 'SourceSansPro-Regular' | 'SourceSansPro-Bold' | 'Bitter-Bold' | 'System'

const buildFont = (family: FontFamily, fontSize: number, lineHeight?: number): string => {
	const styles = [`font-family:"${family}"`, `font-size:${fontSize}px`]
	if (lineHeight) {
		styles.push(`line-height: ${lineHeight}px`)
	}
	return styles.join(';\n')
}

const theme: VATheme = {
	background: '#F2F2F7',
	white: '#FFFFFF',
	text: {
		titleBar: '#323A45',
		primary: '#000000',
	},
	ctaButton: {
		background: '#b51c08',
		contrastText: '#FFFFFF',
	},

	fontFace: {
		regular: 'font-family:"SourceSansPro-Regular";\n',
		bold: 'font-family:"SourceSansPro-Bold";\n',
		altBold: 'font-family:"Bitter-Bold";\n',
	},
	borderColor: '#b8b8bb',

	typography: {
		h1: buildFont('Bitter-Bold', 24, 28),
		h2: buildFont('Bitter-Bold', 22, 26),
		h3: buildFont('Bitter-Bold', 20, 26),
		body1: buildFont('SourceSansPro-Regular', 17, 20),
		body2: buildFont('SourceSansPro-Regular', 16, 19),
	},

	primaryColor: {
		active: '#003E73',
		inactive: '#0071BC',
		contrastText: '#FFFFFF',
	},
	borderWidth: '1px',
}

export default theme
