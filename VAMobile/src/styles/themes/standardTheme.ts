import { Appearance } from 'react-native'

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
    typography: buildTypography(colorScheme),
  }
}

export const getTheme = (): VATheme => {
  return theme
}

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
    lineHeight: 25,
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
    lineHeight: 22,
  },
  LabelTagBold: {
    fontSize: 16,
    lineHeight: 22,
  },
  HelperTextBold: {
    fontSize: 16,
    lineHeight: 22,
  },
  SnackBarBtnText: {
    fontSize: 16,
    lineHeight: 22,
  },
  AppointmentRequestCtaBtnText: {
    fontSize: 18,
    lineHeight: 25,
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

const buildTypography = (scheme: VAColorScheme): VATheme['typography'] => {
  return {
    BitterBoldHeading: buildFont('Bitter-Bold', fontSizes.BitterBoldHeading, scheme.text.primary),
    MobileBody: buildFont('SourceSansPro-Regular', fontSizes.MobileBody, scheme.text.bodyText),
    MobileBodyBold: buildFont('SourceSansPro-Bold', fontSizes.MobileBodyBold, scheme.text.primary),
    UnreadMessagesTag: buildFont('SourceSansPro-Bold', fontSizes.UnreadMessagesTag, scheme.text.primaryContrast),
    LabelTag: buildFont('SourceSansPro-Regular', fontSizes.LabelTag, scheme.text.primaryContrast),
    LabelTagBold: buildFont('SourceSansPro-Bold', fontSizes.LabelTagBold, scheme.text.primaryContrast),
    TableHeaderBold: buildFont('SourceSansPro-Bold', fontSizes.TableHeaderBold, scheme.text.primary),
    TableHeaderLabel: buildFont('SourceSansPro-Regular', fontSizes.TableHeaderLabel, scheme.text.bodyText),
    TableFooterLabel: buildFont('SourceSansPro-Regular', fontSizes.TableFooterLabel, scheme.text.bodyText),
    MobileBodyLink: buildFont('SourceSansPro-Regular', fontSizes.MobileBodyLink, scheme.text.link, true),
    ClaimPhase: buildFont('Bitter-Bold', fontSizes.ClaimPhase, colors.white),
    ActionBar: buildFont('SourceSansPro-Regular', fontSizes.ActionBar, scheme.text.actionBar),
    VASelector: buildFont('SourceSansPro-Regular', fontSizes.VASelector, scheme.text.bodyText),
    HelperText: buildFont('SourceSansPro-Regular', fontSizes.HelperText, scheme.text.bodyText),
    HelperTextBold: buildFont('SourceSansPro-Bold', fontSizes.HelperTextBold, scheme.text.primary),
    SnackBarBtnText: buildFont('SourceSansPro-Bold', fontSizes.SnackBarBtnText, scheme.text.snackBarBtn),
    AppointmentRequestCtaBtnText: buildFont('SourceSansPro-Bold', fontSizes.AppointmentRequestCtaBtnText, scheme.text.AppointmentRequestCtaBtnText),
  }
}

let theme: VATheme = {
  colors: {
    ...colorScheme,
  },
  dimensions: {
    attachmentIconTopMargin: 8,
    borderWidth: 1,
    focusedInputBorderWidth: 2,
    buttonBorderWidth: 2,
    gutter: 20,
    textIconMargin: 5,
    contentMarginTop: 20,
    contentMarginBottom: 40,
    standardMarginBetween: 20,
    condensedMarginBetween: 10,
    cardPadding: 20,
    buttonPadding: 10,
    alertBorderWidth: 8,
    listItemDecoratorMarginLeft: 20,
    navBarHeight: 56,
    touchableMinHeight: 44,
    textAndButtonLargeMargin: 40,
    headerHeight: 64,
    formMarginBetween: 30,
    tagMinWidth: 29,
    tagCurvedBorder: 2,
    tagTopPadding: 3,
    tagHorizontalPadding: 10,
    maxNumMessageAttachments: 4,
    paginationTopPadding: 40,
    snackBarBottomOffset: isIOS() ? 25 : 0, // this is done due to in android the spacing is higher for the offset
    snackBarBottomOffsetWithNav: isIOS() ? 94 : 66, // this is done due to in android the spacing is higher for the offset
    chevronListItemWidth: 10,
    chevronListItemHeight: 15,
    headerButtonSpacing: 10,
    headerLeftButtonFromTextPadding: 14,
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
    HelperText: fontSizes.HelperText,
    HelperTextBold: fontSizes.HelperTextBold,
    LabelTag: fontSizes.LabelTag,
    LabelTagBold: fontSizes.LabelTagBold,
  },
  typography: buildTypography(colorScheme),
}

export default theme
