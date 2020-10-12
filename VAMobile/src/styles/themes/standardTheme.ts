import { VATheme } from 'styles/theme'
import colors from './VAColors'
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
			link: colors.linkDefault, //'#004795',
			nav: colors.linkDefault, //'#004795',
			disclosure: '#b8b8bb',
			success: colors.green, //'#2E8540',
			error: colors.secondaryDark, //'#CD2026',
			active: colors.primaryDarker, //'#003E73',
			inactive: '#0071BC',
			contrast: '#FFFFFF',
		},
		text: {
			navBar: '#FFFFFF',
			primary: primaryTextColor,
			primaryContrast: '#FFFFFF',
			secondary: '#000000',
			error: colors.secondaryDark, //'#CD2026',
			link: colors.linkDefault,
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
		heading: buildFont('Bitter-Bold', 20, 26),
		body: buildFont('SourceSansPro-Regular', 17, 20),
		bodyBold: buildFont('SourceSansPro-Bold', 17, 20),
		tableHeader: buildFont('SourceSansPro-Regular', 14, 18),
		tableFooter: buildFont('SourceSansPro-Regular', 14, 18),
	},
}

export default theme
