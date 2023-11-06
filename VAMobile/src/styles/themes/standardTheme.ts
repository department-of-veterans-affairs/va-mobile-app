import { Appearance } from 'react-native'

import { VAColorScheme, VAFontSizes, VATheme } from 'styles/theme'
import { changeNavigationBarColor } from 'utils/rnNativeUIUtilities'
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
    mode: scheme,
    typography: buildTypography(colorScheme),
  }
  changeNavigationBarColor(scheme === 'dark' ? '#121212' : '#EFEFEF', scheme === 'dark' ? true : false, true)
}

export const getTheme = (): VATheme => {
  return theme
}

const fontSizes = {
  ActionBar: {
    fontSize: 20,
    lineHeight: 30,
  },
  BitterBoldHeading: {
    fontSize: 26,
    lineHeight: 32,
  },
  ClaimPhase: {
    fontSize: 20,
    lineHeight: 30,
  },
  DescriptiveBackButton: {
    fontSize: 16,
    lineHeight: 22,
  },
  HelperText: {
    fontSize: 16,
    lineHeight: 24,
  },
  LabelTag: {
    fontSize: 16,
    lineHeight: 24,
  },
  MobileBody: {
    fontSize: 20,
    lineHeight: 30,
  },
  MobileBodyTight: {
    fontSize: 20,
    lineHeight: 24,
  },
  SnackBarBtnText: {
    fontSize: 16,
    lineHeight: 24,
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
    lineHeight: 21,
  },
  textWithIconButton: {
    fontSize: 12,
    lineHeight: 15,
  },
  UnreadMessagesTag: {
    fontSize: 20,
    lineHeight: 30,
  },
  VAHeader: {
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -1.7,
  },
  VASelector: {
    fontSize: 20,
    lineHeight: 30,
  },
  webviewTitle: {
    fontSize: 12,
    lineHeight: 12,
  },
}

const buildFont = (family: FontFamily, fontSizing: VAFontSizes, color?: string, underline?: boolean): string => {
  const { fontSize, letterSpacing, lineHeight } = fontSizing
  const styles = [`color:${primaryTextColor}`, `font-family:"${family}"`, `font-size:${fontSize}px`, `line-height: ${lineHeight}px`]

  if (color) {
    styles.push(`color: ${color}`)
  }
  if (underline) {
    styles.push('textDecorationLine: underline')
  }
  if (letterSpacing) {
    styles.push(`letter-spacing: ${letterSpacing}px`)
  }
  return styles.join(';\n')
}

const buildTypography = (scheme: VAColorScheme): VATheme['typography'] => {
  return {
    ActionBar: buildFont('SourceSansPro-Regular', fontSizes.ActionBar, scheme.text.actionBar),
    BitterBoldHeading: buildFont('Bitter-Bold', fontSizes.BitterBoldHeading, scheme.text.primary),
    ClaimPhase: buildFont('Bitter-Bold', fontSizes.ClaimPhase, colors.white),
    DescriptiveBackButton: buildFont('SourceSansPro-Regular', fontSizes.DescriptiveBackButton, scheme.text.descriptiveBackButton),
    HelperText: buildFont('SourceSansPro-Regular', fontSizes.HelperText, scheme.text.bodyText),
    HelperTextBold: buildFont('SourceSansPro-Bold', fontSizes.HelperText, scheme.text.primary),
    LabelTag: buildFont('SourceSansPro-Regular', fontSizes.LabelTag, scheme.text.primaryContrast),
    MobileBody: buildFont('SourceSansPro-Regular', fontSizes.MobileBody, scheme.text.bodyText),
    MobileBodyBold: buildFont('SourceSansPro-Bold', fontSizes.MobileBody, scheme.text.primary),
    MobileBodyLink: buildFont('SourceSansPro-Regular', fontSizes.MobileBody, scheme.text.link, true),
    MobileBodyTight: buildFont('SourceSansPro-Regular', fontSizes.MobileBodyTight, scheme.text.bodyText),
    SnackBarBtnText: buildFont('SourceSansPro-Bold', fontSizes.SnackBarBtnText, scheme.text.snackBarBtn),
    TableHeaderBold: buildFont('SourceSansPro-Bold', fontSizes.TableHeaderBold, scheme.text.primary),
    TableHeaderLabel: buildFont('SourceSansPro-Regular', fontSizes.TableHeaderLabel, scheme.text.bodyText),
    TableFooterLabel: buildFont('SourceSansPro-Regular', fontSizes.TableFooterLabel, scheme.text.bodyText),
    textWithIconButton: buildFont('SourceSansPro-Regular', fontSizes.textWithIconButton, scheme.text.textWithIconButton),
    UnreadMessagesTag: buildFont('SourceSansPro-Bold', fontSizes.UnreadMessagesTag, scheme.text.primaryContrast),
    VAHeader: buildFont('SourceSansPro-Bold', fontSizes.VAHeader, scheme.text.primary),
    VASelector: buildFont('SourceSansPro-Regular', fontSizes.VASelector, scheme.text.bodyText),
    webviewTitle: buildFont('SourceSansPro-Regular', fontSizes.webviewTitle, scheme.text.webviewTitle),
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
    maxNumMessageAttachments: 4,
    paginationTopPadding: 40,
    snackBarBottomOffset: isIOS() ? 25 : 0, // this is done due to in android the spacing is higher for the offset
    snackBarBottomOffsetWithNav: isIOS() ? 94 : 66, // this is done due to in android the spacing is higher for the offset
    chevronListItemWidth: 10,
    chevronListItemHeight: 15,
    headerButtonSpacing: 10,
    headerLeftButtonFromTextPadding: 14,
    fullScreenNavigationBarOffset: isIOS() ? 30 : 0, // this is done due to how the top of the screens differ between the two systems
    fullScreenContentButtonHeight: 60,
  },

  fontFace: {
    regular: 'SourceSansPro-Regular',
    bold: 'SourceSansPro-Bold',
    altBold: 'Bitter-Bold',
  },

  fontSizes: {
    BitterBoldHeading: fontSizes.BitterBoldHeading,
    ClaimPhase: fontSizes.ClaimPhase,
    HelperText: fontSizes.HelperText,
    LabelTag: fontSizes.LabelTag,
    MobileBody: fontSizes.MobileBody,
    MobileBodyTight: fontSizes.MobileBodyTight,
    TableHeaderBold: fontSizes.TableHeaderBold,
    TableHeaderLabel: fontSizes.TableHeaderLabel,
    TableFooterLabel: fontSizes.TableFooterLabel,
    UnreadMessagesTag: fontSizes.UnreadMessagesTag,
    VASelector: fontSizes.VASelector,
  },
  mode: Appearance.getColorScheme() === ColorSchemeConstantType.dark ? 'dark' : 'light',
  paragraphSpacing: {
    spacing12FontSize: 24,
    spacing14FontSize: 28,
    spacing16FontSize: 32,
    spacing18FontSize: 36,
    spacing20FontSize: 40,
    spacing26FontSize: 52,
    spacing28FontSize: 56,
  },
  typography: buildTypography(colorScheme),
}

export default theme
