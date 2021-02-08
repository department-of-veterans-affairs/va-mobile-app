import { Platform } from 'react-native'
import { VAFontSizes, VATheme } from 'styles/theme'
import colors from './VAColors'

type FontFamily = 'SourceSansPro-Regular' | 'SourceSansPro-Bold' | 'Bitter-Bold' | 'System'

const primaryTextColor = colors.grayDark
const claimPhaseLineHeight = Platform.OS === 'ios' ? 20 : 30

const fontSizes = {
  BitterBoldHeading: {
    fontSize: 24,
    lineHeight: 30,
  },
  MobileBody: {
    fontSize: 20,
    lineHeight: 30,
  },
  MobileBodyBold: {
    fontSize: 20,
    lineHeight: 30,
  },
  TableHeaderBold: {
    fontSize: 20,
    lineHeight: 30,
  },
  TableHeaderLabel: {
    fontSize: 20,
    lineHeight: 30,
  },
  TableFooterLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
  MobileBodyLink: {
    fontSize: 20,
    lineHeight: 30,
  },
  ClaimPhase: {
    fontSize: 20,
    lineHeight: claimPhaseLineHeight,
  },
  ActionBar: {
    fontSize: 20,
    lineHeight: 18,
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
      disabledButton: colors.grayLighter,
      profileBanner: colors.grayDark,
      ctaButton: colors.crisisLineRed,
      covid19Vaccinations: colors.primary,
      completedPhase: colors.greenDarker,
      currentPhase: colors.primary,
      upcomingPhase: colors.grayLight,
      splashScreen: colors.primaryDarker,
      carousel: colors.primaryDark,
      covid19VaccinationsActive: colors.primaryDarkest,
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
      phaseIndicatorCurrent: colors.primaryDarkest,
      phaseIndicatorUpcoming: colors.grayLight,
      success: colors.green,
      primaryDarkest: colors.primaryDarkest,
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
      covid19Vaccinations: colors.white,
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
      covid19Vaccinations: colors.white,
      claimPhase: colors.white,
      altButton: colors.primaryDarker,
    },
    control: {
      tintColor: colors.primary,
      switchOnTrack: colors.primary,
      switchOffTrack: colors.grayLight,
      switchOnThumb: colors.white,
      switchOffThumb: colors.grayLightest,
    },
    segmentedControl: {
      buttonActive: colors.white,
      buttonInactive: colors.grayLighter,
    },
  },

  dimensions: {
    borderWidth: 1,
    buttonBorderWidth: 2,
    gutter: 20,
    textIconMargin: 5,
    textXPadding: 20,
    contentMarginTop: 20,
    contentMarginBottom: 40,
    marginBetween: 20,
    cardPadding: 20,
    cardMargin: 20,
    buttonPadding: 10,
    alertBorderWidth: 8,
    alertPaddingY: 20,
    alertPaddingX: 10,
    listItemDecoratorMarginLeft: 9,
    noLettersPaddingY: 6,
    datePickerArrowsPaddingRight: 15,
    datePickerArrowsPaddingTopAndroid: 18,
    pickerLabelMargin: 5,
    checkboxLabelMargin: 10,
    navigationBarIconMarginTop: 7,
    touchableMinHeight: 44,
    marginBetweenCards: 10,
    headerButtonMargin: 16,
    headerButtonPadding: 14,
    titleHeaderAndElementMargin: 10,
    textInputLabelMarginBottom: 5,
    phaseIndicatorRightMargin: 10,
    phaseIndicatorDiameter: 30,
    phaseIndicatorBorderWidth: 2,
    phaseIndicatorIconWidth: 15,
    phaseIndicatorIconHeight: 15,
    phaseIndicatorTextPadding: 5,
    bulletMargin: 12,
    inputAndPickerLabelWidth: 90,
    androidPickerPaddingL: 16,
    textAndButtonLargeMargin: 40,
    fileUploadMargin: 40,
    androidPickerPaddingLMultiLine: 12,
    singleLinePickerHeight: 52,
    biometricsPreferenceMarginTop: 60,
    singleLineTextInputHeight: 62,
    carouselProgressDotsMargin: 6,
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
    ClaimPhase: fontSizes.ClaimPhase,
  },

  typography: {
    BitterBoldHeading: buildFont('Bitter-Bold', fontSizes.BitterBoldHeading),
    MobileBody: buildFont('SourceSansPro-Regular', fontSizes.MobileBody),
    MobileBodyBold: buildFont('SourceSansPro-Bold', fontSizes.MobileBodyBold),
    TableHeaderBold: buildFont('SourceSansPro-Bold', fontSizes.TableHeaderBold),
    TableHeaderLabel: buildFont('SourceSansPro-Regular', fontSizes.TableHeaderLabel),
    TableFooterLabel: buildFont('SourceSansPro-Regular', fontSizes.TableFooterLabel),
    MobileBodyLink: buildFont('SourceSansPro-Regular', fontSizes.MobileBodyLink, colors.linkDefault, true),
    ClaimPhase: buildFont('Bitter-Bold', fontSizes.ClaimPhase, colors.white),
    ActionBar: buildFont('SourceSansPro-Regular', fontSizes.ActionBar),
  },
}

export default theme
