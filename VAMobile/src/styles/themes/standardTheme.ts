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
      segmentedController: colors.grayLighter,
      shadow: colors.grayMedium,
      button: colors.primary,
    },
    border: {
      primary: colors.grayLight,
      secondary: colors.primary,
      informational: colors.primaryAltDark,
      error: colors.secondaryDark,
      warning: colors.warningMessage,
    },
    icon: {
      link: colors.linkDefault, //'#004795',
      nav: colors.linkDefault, //'#004795',
      disclosure: colors.grayLight,
      success: colors.green, //'#2E8540',
      error: colors.secondaryDark, //'#CD2026',
      active: colors.primaryDarker, //'#003E73',
      inactive: colors.primary,
      contrast: colors.white,
      expandCollapse: colors.black,
      checkboxEnabledPrimary: colors.primary,
      checkboxDisabled: colors.grayMedium,
      checkboxDisabledContrast: colors.white,
    },
    text: {
      navBar: colors.white,
      primary: primaryTextColor,
      primaryContrast: colors.white,
      primaryContrastDisabled: colors.grayLight,
      secondary: colors.black,
      error: colors.secondaryDark, //'#CD2026',
      link: colors.linkDefault,
      placeholder: colors.grayMedium, //#757575
      checkboxDisabled: colors.grayMedium,
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
    segmentedControl: {
      buttonActive: colors.white,
      buttonInactive: colors.grayLighter,
    },
  },

  dimensions: {
    borderWidth: 1,
    gutter: 20,
    textIconMargin: 5,
    textXPadding: 20,
    contentMarginTop: 20,
    contentMarginBottom: 40,
    marginBetween: 20,
    cardPaddingY: 20,
    cardMargin: 20,
    buttonPadding: 10,
    editAddressMarginTop: 12,
    editAddressCheckboxPl: 20,
    editAddressCheckboxPt: 20,
    editAddressCheckboxPb: 18,
    editAddressStreetAddressMarginTop: 16,
    editAddressContentMarginTop: 10,
    editAddressContentMarginBottom: 10,
    collapsibleViewPaddingX: 20,
    collapsibleViewPaddingTop: 17,
    editDirectDepositInputFieldMarginTop: 8,
    alertBorderWidth: 8,
    alertPaddingY: 20,
    alertPaddingX: 10,
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
    TableHeaderBold: buildFont('SourceSansPro-Bold', 14, 18),
    TableHeaderLabel: buildFont('SourceSansPro-Regular', 14, 18),
    TableFooterLabel: buildFont('SourceSansPro-Regular', 14, 18),
    MobileBodyLink: buildFont('SourceSansPro-Regular', 17, 26, colors.linkDefault, true),
  },
}

export default theme
