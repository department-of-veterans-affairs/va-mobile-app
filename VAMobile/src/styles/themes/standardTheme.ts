import { VATheme } from 'styles/theme'
import colors from './VAColors'
type FontFamily = 'SourceSansPro-Regular' | 'SourceSansPro-Bold' | 'Bitter-Bold' | 'System'

const primaryTextColor = colors.grayDark

const buildFont = (family: FontFamily, fontSize: number, lineHeight?: number, color?: string, underline?: boolean): string => {
	const styles = [`color:${primaryTextColor}`, `font-family:"${family}"`, `font-size:${fontSize}px`]
	if (lineHeight) {
		styles.push(`line-height: ${lineHeight}px`)
	}
	if (color) {
		styles.push(`color: ${color}`)
	}
	if (underline) {
		styles.push('textDecorationLine: underline')
	}
	return styles.join(';\n')
}

const theme: VATheme = {
	colors: {
		background: {
			main: '#F2F2F7',
			textBox: colors.white,
			buttonList: colors.white,
		},
		border: {
			primary: '#b8b8bb',
		},
		icon: {
			link: colors.linkDefault, //'#004795',
			nav: colors.linkDefault, //'#004795',
			disclosure: '#b8b8bb',
			success: colors.green, //'#2E8540',
			error: colors.secondaryDark, //'#CD2026',
			active: colors.primaryDarker, //'#003E73',
			inactive: colors.primary,
			contrast: colors.white,
		},
		text: {
			navBar: colors.white,
			primary: primaryTextColor,
			primaryContrast: colors.white,
			secondary: colors.black,
			error: colors.secondaryDark, //'#CD2026',
			link: colors.linkDefault,
		},
		control: {
			tintColor: colors.primary,
			switchOnTrack: colors.primary,
			switchOffTrack: colors.grayLight,
			switchOnThumb: colors.white,
			switchOffThumb: colors.grayLightest,
		},
		ctaButton: {
			background: colors.crisisLineRed,
			text: colors.white,
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
		BitterBoldHeading: buildFont('Bitter-Bold', 20, 26),
		MobileBody: buildFont('SourceSansPro-Regular', 17, 26),
		MobileBodyBold: buildFont('SourceSansPro-Bold', 17, 26),
		MobileHeaderBold: buildFont('SourceSansPro-Bold', 14, 18),
		TableHeaderLabel: buildFont('SourceSansPro-Regular', 14, 18),
		TableFooterLabel: buildFont('SourceSansPro-Regular', 14, 18),
		MobileBodyLink: buildFont('SourceSansPro-Regular', 17, 26, colors.linkDefault, true),
	},
}

export default theme
