import { Platform } from 'react-native'
import { VAFontSizes, VATheme } from 'styles/theme'
import { isIOS } from 'utils/platform'
import colors from './VAColors'

type FontFamily = 'SourceSansPro-Regular' | 'SourceSansPro-Bold' | 'Bitter-Bold' | 'System'

const primaryTextColor = colors.grayDark
const claimPhaseLineHeight = Platform.OS === 'ios' ? 25 : 30

const fontSizes = {
  BitterBoldHeading: {
    fontSize: 26,
    lineHeight: 32,
  },
  MobileBody: {
    fontSize: 20,
    lineHeight: 30,
  },
  MobileBodyBold: {
    fontSize: 20,
    lineHeight: 30,
  },
  UnreadMessagesTag: {
    fontSize: 20,
    lineHeight: 20,
  },
  SentMessagesReadTag: {
    fontSize: 16,
    lineHeight: 16,
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
    lineHeight: 30,
  },
  VASelector: {
    fontSize: 20,
    lineHeight: 24,
  },
  HelperText: {
    fontSize: 16,
    lineHeight: 22,
  },
  SnackBarBtnText: {
    fontSize: 16,
    lineHeight: 22,
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
      main: colors.grayLightest,
      footerButtonActive: colors.primaryDarkest,
      textBox: colors.white,
      list: colors.white,
      listActive: colors.primaryAltLightest,
      segmentedController: colors.grayLighter,
      shadow: colors.grayMedium,
      profileBanner: colors.primary,
      ctaButton: colors.crisisLineRed,
      covid19Vaccinations: colors.primary,
      completedPhase: colors.greenDarker,
      currentPhase: colors.primary,
      upcomingPhase: colors.grayLight,
      splashScreen: colors.primaryDarker,
      carousel: colors.primaryDark,
      covid19VaccinationsActive: colors.primaryDarkest,
      unreadMessagesTag: colors.grayDark,
      navHeader: colors.primaryDarker,
      modalOverlay: colors.base,
      pickerSelectedItem: colors.primaryAltLightest,
      navButton: colors.toolbarBackgroundGray,
      snackbar: colors.snackBarBlack,
      menu: colors.white,
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
      pickerAndInput: colors.gray,
      focusedPickerAndInput: colors.primaryDarker,
      confirmation: colors.goldLight,
      menuDivider: colors.grayLight,
    },
    icon: {
      footerButton: colors.primary,
      footerButtonActive: colors.white,
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
      grayDark: colors.grayDark,
      pagination: colors.white,
      chevronCollapsible: colors.primary,
      chevronListItem: colors.primary,
    },
    text: {
      footerButton: colors.primary,
      footerButtonActive: colors.white,
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
      snackBarBtn: colors.lightBlue,
    },
    buttonBackground: {
      buttonPrimary: colors.primary,
      buttonPrimaryActive: colors.primaryDarkest,
      buttonSecondary: colors.white,
      buttonSecondaryActive: colors.primaryAltLightest,
      buttonImportant: colors.white,
      buttonImportantActive: colors.white,
      buttonDisabled: colors.grayMedium,
      buttonSecondaryDisabled: colors.grayLight,
      buttonWhite: colors.white,
      buttonWhiteActive: colors.whiteWith70PercentOpacity,
    },
    buttonText: {
      buttonPrimary: colors.white,
      buttonSecondary: colors.primaryDarker,
      buttonDisabled: colors.white,
      buttonImportant: colors.secondaryDark,
    },
    buttonBorder: {
      buttonSecondary: colors.primary,
      buttonSecondaryActive: colors.primaryDarkest,
      buttonImportant: colors.secondaryDark,
      buttonImportantActive: colors.secondaryDarkest,
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
    selectCopyText: colors.primaryAltLight,
  },

  dimensions: {
    keyboardManagerDistanceFromTextField: 45,
    borderWidth: 1,
    focusedInputBorderWidth: 2,
    buttonBorderWidth: 2,
    gutter: 20,
    textIconMargin: 5,
    textXPadding: 20,
    contentMarginTop: 20,
    contentMarginBottom: 40,
    standardMarginBetween: 20,
    condensedMarginBetween: 10,
    cardPadding: 20,
    cardMargin: 20,
    buttonPadding: 10,
    alertBorderWidth: 8,
    alertPaddingY: 20,
    alertPaddingX: 10,
    listItemDecoratorMarginLeft: 20,
    noLettersPaddingY: 6,
    datePickerArrowsPaddingRight: 15,
    pickerLabelMargin: 9,
    checkboxLabelMargin: 10,
    navigationBarIconMarginTop: 7,
    navBarHeight: 56,
    touchableMinHeight: 44,
    textAreaHeight: 201,
    headerButtonMargin: 10,
    headerButtonPadding: 14,
    textInputLabelMarginBottom: 5,
    phaseIndicatorRightMargin: 10,
    phaseIndicatorDiameter: 30,
    phaseIndicatorBorderWidth: 2,
    phaseIndicatorIconWidth: 15,
    phaseIndicatorIconHeight: 15,
    bulletMargin: 12,
    textAndButtonLargeMargin: 40,
    fileUploadMargin: 40,
    biometricsPreferenceMarginTop: 60,
    carouselProgressDotsMargin: 6,
    headerHeight: 64,
    textInputMargin: 40,
    formMarginBetween: 30,
    tagCountMinWidth: 29,
    tagCountCurvedBorder: 2,
    tagCountTopPadding: 3,
    messagePhotoAttachmentMaxHeight: 300,
    messageIconLeftMargin: 16,
    maxNumMessageAttachments: 4,
    paginationButtonPadding: 15,
    pickerModalTopPadding: 60,
    pickerModalSelectedIconWidth: 16,
    pickerModalSelectedIconHeight: 13,
    messageSentReadLeftMargin: 23,
    syncLogoSpacing: 50,
    paginationTopPadding: 40,
    collapsibleIconMargin: 7,
    loginContentMarginBottom: 80,
    webviewReloadButtonHeight: isIOS() ? 64 : 45,
    webviewReloadButtonSize: 17,
    webviewButtonSize: 16,
    webviewButtona11ySize: 44,
    errorLabelBottomMargin: 3,
    selectorWidth: 22,
    selectorHeight: 22,
    snackBarPadding: 15,
    snackBarMarginBottom: 0,
    snackBarMarginLeft: 10,
    snackBarMarginRight: 10,
    snackBarButtonTopMargin: 5,
    snackBarConfirmBtnMarginRight: 15,
    snackBarVerticalMargin: 10,
    snackBarBorderRadius: 4,
    snackBarBetweenSpace: 8,
    snackBarShadowX: 0,
    snackBarShadowY: 4,
    snackBarShadowOpacity: 0.6,
    snackBarIconTopMargin: 2,
    snackBarIconSize: 18,
    snackBarBottomOffset: isIOS() ? 25 : 0, // this is done due to in android the spacing is higher for the offset
    snackBarBottomOffsetWithNav: isIOS() ? 94 : 66, // this is done due to in android the spacing is higher for the offset
    menuShadowX: 0,
    menuShadowY: 10,
    menuShadowOpacity: 0.6,
    menuShadowRadius: 14,
    menuOpacity: 0,
    menuBorderRadius: 4,
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
    UnreadMessagesTag: fontSizes.UnreadMessagesTag,
    SentMessagesReadTag: fontSizes.SentMessagesReadTag,
    VASelector: fontSizes.VASelector,
  },

  typography: {
    BitterBoldHeading: buildFont('Bitter-Bold', fontSizes.BitterBoldHeading),
    MobileBody: buildFont('SourceSansPro-Regular', fontSizes.MobileBody),
    MobileBodyBold: buildFont('SourceSansPro-Bold', fontSizes.MobileBodyBold),
    UnreadMessagesTag: buildFont('SourceSansPro-Bold', fontSizes.UnreadMessagesTag),
    SentMessagesReadTag: buildFont('SourceSansPro-Regular', fontSizes.SentMessagesReadTag),
    TableHeaderBold: buildFont('SourceSansPro-Bold', fontSizes.TableHeaderBold),
    TableHeaderLabel: buildFont('SourceSansPro-Regular', fontSizes.TableHeaderLabel),
    TableFooterLabel: buildFont('SourceSansPro-Regular', fontSizes.TableFooterLabel),
    MobileBodyLink: buildFont('SourceSansPro-Regular', fontSizes.MobileBodyLink, colors.linkDefault, true),
    ClaimPhase: buildFont('Bitter-Bold', fontSizes.ClaimPhase, colors.white),
    ActionBar: buildFont('SourceSansPro-Regular', fontSizes.ActionBar),
    VASelector: buildFont('SourceSansPro-Regular', fontSizes.VASelector),
    HelperText: buildFont('SourceSansPro-Regular', fontSizes.HelperText),
    SnackBarBtnText: buildFont('SourceSansPro-Bold', fontSizes.SnackBarBtnText),
  },
}

export default theme
