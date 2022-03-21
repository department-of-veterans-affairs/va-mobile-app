import { Appearance, Platform } from 'react-native'

import { VAColorScheme, VAFontSizes, VATheme } from 'styles/theme'
import { darkTheme, lightTheme, primaryTextColor } from './colorSchemes'
import { isIOS } from 'utils/platform'
import colors from './VAColors'

type FontFamily = 'SourceSansPro-Regular' | 'SourceSansPro-Bold' | 'Bitter-Bold' | 'System'
export type ColorSchemeTypes = null | 'light' | 'dark' | undefined
export const ColorSchemeConstantType: {
  none: ColorSchemeTypes
  notDefined: ColorSchemeTypes
  light: ColorSchemeTypes
  dark: ColorSchemeTypes
} = {
  none: null,
  notDefined: undefined,
  light: 'light',
  dark: 'dark',
}

let colorScheme: VAColorScheme = Appearance.getColorScheme() === ColorSchemeConstantType.dark ? darkTheme : lightTheme

export const setColorScheme = (scheme: ColorSchemeTypes): void => {
  console.log(`set theme: ${scheme}`)
  colorScheme = scheme === ColorSchemeConstantType.dark ? darkTheme : lightTheme
  theme = {
    ...theme,
    colors: { ...colorScheme },
  }
}

export const getTheme = (): VATheme => {
  return theme
}

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
  LabelTag: {
    fontSize: 16,
    lineHeight: 16,
  },
  LabelTagBold: {
    fontSize: 16,
    lineHeight: 16,
  },
  HelperTextBold: {
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

let theme: VATheme = {
  colors: {
    ...colorScheme,
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
    messagesDecoratorMarginLeft: 16,
    noLettersPaddingY: 6,
    datePickerArrowsPaddingRight: 15,
    pickerLabelMargin: 8,
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
    messageIconWidth: 16,
    messageIconHeight: 16,
    maxNumMessageAttachments: 4,
    paginationButtonPadding: 15,
    photoPreviewIconSize: 24,
    photoPreviewBorderRadius: 5,
    photoPreviewIconPadding: 5,
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
    snackBarButtonTopBottomMargin: 5,
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
    menuShadowY: 4,
    menuShadowOpacity: 0.6,
    menuShadowRadius: 4,
    menuOpacity: 0,
    menuBorderRadius: 4,
    menuItemMinWidth: 191,
    menuElevation: 20,
    chevronListItemWidth: 10,
    chevronListItemHeight: 15,
    listTrashIconWidth: 14,
    listTrashIconHeight: 16,
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
    VASelector: fontSizes.VASelector,
    LabelTag: fontSizes.LabelTag,
    LabelTagBold: fontSizes.LabelTagBold,
  },

  typography: {
    BitterBoldHeading: buildFont('Bitter-Bold', fontSizes.BitterBoldHeading),
    MobileBody: buildFont('SourceSansPro-Regular', fontSizes.MobileBody),
    MobileBodyBold: buildFont('SourceSansPro-Bold', fontSizes.MobileBodyBold),
    UnreadMessagesTag: buildFont('SourceSansPro-Bold', fontSizes.UnreadMessagesTag),
    TableHeaderBold: buildFont('SourceSansPro-Bold', fontSizes.TableHeaderBold),
    TableHeaderLabel: buildFont('SourceSansPro-Regular', fontSizes.TableHeaderLabel),
    TableFooterLabel: buildFont('SourceSansPro-Regular', fontSizes.TableFooterLabel),
    MobileBodyLink: buildFont('SourceSansPro-Regular', fontSizes.MobileBodyLink, colors.linkDefault, true),
    ClaimPhase: buildFont('Bitter-Bold', fontSizes.ClaimPhase, colors.white),
    ActionBar: buildFont('SourceSansPro-Regular', fontSizes.ActionBar),
    VASelector: buildFont('SourceSansPro-Regular', fontSizes.VASelector),
    HelperText: buildFont('SourceSansPro-Regular', fontSizes.HelperText),
    HelperTextBold: buildFont('SourceSansPro-Bold', fontSizes.HelperTextBold),
    LabelTag: buildFont('SourceSansPro-Regular', fontSizes.LabelTag),
    LabelTagBold: buildFont('SourceSansPro-Bold', fontSizes.LabelTagBold),
    SnackBarBtnText: buildFont('SourceSansPro-Bold', fontSizes.SnackBarBtnText),
  },
}

export default theme
