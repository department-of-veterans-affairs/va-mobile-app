import { VAFontSizes, VATheme } from 'styles/theme'
import colors from './VAColors'

type FontFamily = 'SourceSansPro-Regular' | 'SourceSansPro-Bold' | 'Bitter-Bold' | 'System'

const primaryTextColor = colors.grayDark

const fontSizes = {
  BitterBoldHeading: {
    fontSize: 20,
    lineHeight: 26,
  },
  MobileBody: {
    fontSize: 17,
    lineHeight: 26,
  },
  MobileBodyBold: {
    fontSize: 17,
    lineHeight: 26,
  },
  TableHeaderBold: {
    fontSize: 14,
    lineHeight: 18,
  },
  TableHeaderLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
  TableFooterLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
  MobileBodyLink: {
    fontSize: 17,
    lineHeight: 26,
  },
}

const buildFont = (family: FontFamily, fontSizing: VAFontSizes, color?: string, underline?: boolean): string => {
  const { fontSize, lineHeight } = fontSizing
  const styles = [`color:${primaryTextColor}`, `font-family:"${family}"`, `font-size:${fontSize}px`, `line-height: ${lineHeight}px`]

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
      list: colors.white,
      segmentedController: colors.grayLighter,
      shadow: colors.grayMedium,
      button: colors.primary,
      profileBanner: colors.grayDark,
    },
    alertBox: {
      cardBackground: colors.grayLightest,
      noCardBackground: colors.white,
    },
    border: {
      primary: colors.grayLight,
      secondary: colors.primary,
      informational: colors.primaryAltDark,
      error: colors.secondaryDark,
      warning: colors.warningMessage,
    },
    icon: {
      link: colors.primary, //'#0071bb',
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
      spinner: colors.grayMedium,
      dark: colors.black,
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
      canceledText: colors.crisisLineRed,
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
    profileBannerIconMargin: 12,
    switchMarginLeft: 9,
    noLettersPaddingY: 6,
    datePickerArrowsPaddingRight: 15,
    datePickerArrowsPaddingTopAndroid: 18,
    pickerLabelMargin: 5,
  },

  fontFace: {
    regular: 'SourceSansPro-Regular',
    bold: 'SourceSansPro-Bold',
    altBold: 'Bitter-Bold',
  },

  fontSizes: {
    BitterBoldHeading: fontSizes.BitterBoldHeading,
    MobileBody: fontSizes.MobileBody,
    MobileBodyBold: fontSizes.MobileBodyBold,
    TableHeaderBold: fontSizes.TableHeaderBold,
    TableHeaderLabel: fontSizes.TableHeaderLabel,
    TableFooterLabel: fontSizes.TableFooterLabel,
    MobileBodyLink: fontSizes.MobileBodyLink,
  },

  typography: {
    BitterBoldHeading: buildFont('Bitter-Bold', fontSizes.BitterBoldHeading),
    MobileBody: buildFont('SourceSansPro-Regular', fontSizes.MobileBody),
    MobileBodyBold: buildFont('SourceSansPro-Bold', fontSizes.MobileBodyBold),
    TableHeaderBold: buildFont('SourceSansPro-Bold', fontSizes.TableHeaderBold),
    TableHeaderLabel: buildFont('SourceSansPro-Regular', fontSizes.TableHeaderLabel),
    TableFooterLabel: buildFont('SourceSansPro-Regular', fontSizes.TableFooterLabel),
    MobileBodyLink: buildFont('SourceSansPro-Regular', fontSizes.MobileBodyLink, colors.linkDefault, true),
  },
}

export default theme
