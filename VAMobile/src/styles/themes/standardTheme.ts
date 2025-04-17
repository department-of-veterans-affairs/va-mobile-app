import { Appearance } from 'react-native'

import { colors } from '@department-of-veterans-affairs/mobile-tokens'

import { VAColorScheme, VAFontSizes, VATheme } from 'styles/theme'
import { isIOS } from 'utils/platform'

import { darkTheme, lightTheme, primaryTextColor } from './colorSchemes'

type FontFamily = 'SourceSansPro-Regular' | 'SourceSansPro-Bold' | 'Bitter-Bold' | 'System' | 'Bitter-Regular'
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
}

export const getTheme = (): VATheme => {
  return theme
}

const fontSizes = {
  AboutYou: {
    fontSize: 18,
    lineHeight: 22,
  },
  ActionBar: {
    fontSize: 20,
    lineHeight: 30,
  },
  ActivityButtonSubtext: {
    fontSize: 16,
    lineHeight: 20,
  },
  ActivityFooter: {
    fontSize: 14,
    lineHeight: 22,
  },
  AnnouncementBannerTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  LargeButtonHeader: {
    fontSize: 22,
    lineHeight: 24,
  },
  BitterHeading: {
    fontSize: 26,
    lineHeight: 28,
  },
  BitterBoldHeading: {
    fontSize: 26,
    lineHeight: 32,
  },
  CategoryLandingAlert: {
    fontSize: 16,
    lineHeight: 24,
  },
  ClaimPhase: {
    fontSize: 20,
    lineHeight: 30,
  },
  CrisisLineButton: {
    fontSize: 16,
    lineHeight: 20,
  },
  DescriptiveBackButton: {
    fontSize: 16,
    lineHeight: 22,
  },
  HomeScreen: {
    fontSize: 16,
    lineHeight: 24,
  },
  HomeScreenHeader: {
    fontSize: 20,
    lineHeight: 30,
  },
  ProfileScreenHeader: {
    fontSize: 18,
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
  NametagNumbers: {
    fontSize: 36,
    lineHeight: 43,
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
    fontSize: 16,
    lineHeight: 20,
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
    fontSize: 20,
    lineHeight: 30,
  },
  veteranStatus: {
    fontSize: 16,
    lineHeight: 18,
  },
  largeNavSubext: {
    fontSize: 16,
    lineHeight: 20,
  },
  FooterText: {
    fontSize: 14,
    lineHeight: 22,
  },
  VeteranStatusCardHeaderPortraitBold: {
    fontSize: 24,
    lineHeight: 26,
  },
  VeteranStatusCardHeaderLandscapeBold: {
    fontSize: 28,
    lineHeight: 31,
  },
}

const buildFont = (family: FontFamily, fontSizing: VAFontSizes, color?: string, underline?: boolean): string => {
  const { fontSize, letterSpacing, lineHeight } = fontSizing
  const styles = [
    `color:${primaryTextColor}`,
    `font-family:"${family}"`,
    `font-size:${fontSize}px`,
    `line-height: ${lineHeight}px`,
  ]

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
    AboutYou: buildFont('Bitter-Regular', fontSizes.AboutYou, scheme.text.veteranStatusBranch),
    ActionBar: buildFont('SourceSansPro-Regular', fontSizes.ActionBar, scheme.text.actionBar),
    ActivityButtonHeader: buildFont('Bitter-Regular', fontSizes.LargeButtonHeader, scheme.text.activityButton),
    ActivityButtonSubtext: buildFont('SourceSansPro-Bold', fontSizes.ActivityButtonSubtext, scheme.text.activityButton),
    ActivityFooter: buildFont('SourceSansPro-Regular', fontSizes.ActivityFooter, scheme.text.activityFooter),
    AnnouncementBannerTitle: buildFont(
      'SourceSansPro-Bold',
      fontSizes.AnnouncementBannerTitle,
      scheme.text.announcementBanner,
    ),
    BitterHeading: buildFont('Bitter-Regular', fontSizes.BitterHeading, scheme.text.homeScreen),
    BitterBoldHeading: buildFont('Bitter-Bold', fontSizes.BitterBoldHeading, scheme.text.primary),
    CategoryLandingError: buildFont(
      'SourceSansPro-Bold',
      fontSizes.CategoryLandingAlert,
      scheme.text.categoryLandingError,
    ),
    CategoryLandingWarning: buildFont(
      'SourceSansPro-Regular',
      fontSizes.CategoryLandingAlert,
      scheme.text.categoryLandingWarning,
    ),
    ClaimPhase: buildFont('Bitter-Bold', fontSizes.ClaimPhase, colors.vadsColorWhite),
    CrisisLineButton: buildFont('SourceSansPro-Regular', fontSizes.CrisisLineButton, scheme.text.crisisLineButton),
    DescriptiveBackButton: buildFont('SourceSansPro-Regular', fontSizes.DescriptiveBackButton, scheme.text.link),
    HelperText: buildFont('SourceSansPro-Regular', fontSizes.HelperText, scheme.text.bodyText),
    HelperTextBold: buildFont('SourceSansPro-Bold', fontSizes.HelperText, scheme.text.primary),
    HomeScreen: buildFont('SourceSansPro-Regular', fontSizes.HomeScreen, scheme.text.homeScreen),
    HomeScreenHeader: buildFont('SourceSansPro-Bold', fontSizes.HomeScreenHeader, scheme.text.homeScreen),
    ProfileScreenHeader: buildFont('Bitter-Regular', fontSizes.ProfileScreenHeader, scheme.text.profileScreen),
    LargeNavButton: buildFont('Bitter-Regular', fontSizes.LargeButtonHeader, scheme.text.homeScreen),
    LargeNavSubtext: buildFont('SourceSansPro-Bold', fontSizes.largeNavSubext, scheme.text.homeScreen),
    LabelTag: buildFont('SourceSansPro-Regular', fontSizes.LabelTag, scheme.text.primaryContrast),
    MobileBody: buildFont('SourceSansPro-Regular', fontSizes.MobileBody, scheme.text.bodyText),
    MobileBodyBold: buildFont('SourceSansPro-Bold', fontSizes.MobileBody, scheme.text.primary),
    MobileBodyLink: buildFont('SourceSansPro-Regular', fontSizes.MobileBody, scheme.text.link, true),
    MobileBodyTight: buildFont('SourceSansPro-Regular', fontSizes.MobileBodyTight, scheme.text.bodyText),
    MobileBodyTightBold: buildFont('SourceSansPro-Bold', fontSizes.MobileBodyTight, scheme.text.bodyText),
    NametagNumber: buildFont('Bitter-Regular', fontSizes.NametagNumbers, scheme.text.veteranStatusBranch),
    TableHeaderBold: buildFont('SourceSansPro-Bold', fontSizes.TableHeaderBold, scheme.text.primary),
    TableHeaderLabel: buildFont('SourceSansPro-Regular', fontSizes.TableHeaderLabel, scheme.text.bodyText),
    TableFooterLabel: buildFont('SourceSansPro-Regular', fontSizes.TableFooterLabel, scheme.text.bodyText),
    textWithIconButton: buildFont('SourceSansPro-Regular', fontSizes.textWithIconButton, scheme.text.link),
    UnreadMessagesTag: buildFont('SourceSansPro-Bold', fontSizes.UnreadMessagesTag, scheme.text.primaryContrast),
    VAHeader: buildFont('SourceSansPro-Bold', fontSizes.VAHeader, scheme.text.primary),
    VASelector: buildFont('SourceSansPro-Regular', fontSizes.VASelector, scheme.text.bodyText),
    VeteranStatusBranch: buildFont(
      'SourceSansPro-Regular',
      fontSizes.ActivityButtonSubtext,
      scheme.text.veteranStatusBranch,
    ),
    VeteranStatusProof: buildFont('SourceSansPro-Regular', fontSizes.veteranStatus, scheme.text.veteranStatusProof),
    webviewTitle: buildFont('SourceSansPro-Regular', fontSizes.webviewTitle, scheme.text.webviewTitle),
    MobileFooterLink: buildFont('SourceSansPro-Regular', fontSizes.FooterText, scheme.text.link, true),
    VeteranStatusCardHeaderPortraitBold: buildFont(
      'SourceSansPro-Bold',
      fontSizes.VeteranStatusCardHeaderPortraitBold,
      scheme.text.primary,
    ),
    VeteranStatusCardHeaderLandscapeBold: buildFont(
      'SourceSansPro-Bold',
      fontSizes.VeteranStatusCardHeaderLandscapeBold,
      scheme.text.primary,
    ),
  }
}

let theme: VATheme = {
  colors: {
    ...colorScheme,
  },
  dimensions: {
    attachmentIconTopMargin: 6,
    borderWidth: 1,
    focusedInputBorderWidth: 2,
    buttonBorderWidth: 2,
    gutter: 20,
    textIconMargin: 5,
    contentMarginTop: 20,
    contentMarginBottom: 40,
    standardMarginBetween: 20,
    condensedMarginBetween: 10,
    tinyMarginBetween: 5,
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
    snackBarBottomOffset: 20,
    chevronListItemWidth: 30,
    chevronListItemHeight: 30,
    linkRowChevronPaddingRight: 18,
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
    ActivityButtonSubtext: fontSizes.ActivityButtonSubtext,
    AnnouncementBannerTitle: fontSizes.AnnouncementBannerTitle,
    BitterHeading: fontSizes.BitterHeading,
    BitterBoldHeading: fontSizes.BitterBoldHeading,
    CategoryLandingAlert: fontSizes.CategoryLandingAlert,
    ClaimPhase: fontSizes.ClaimPhase,
    CrisisLineButton: fontSizes.CrisisLineButton,
    HelperText: fontSizes.HelperText,
    LabelTag: fontSizes.LabelTag,
    MobileBody: fontSizes.MobileBody,
    MobileBodyTight: fontSizes.MobileBodyTight,
    MobileBodyTightBold: fontSizes.MobileBodyTight,
    TableHeaderBold: fontSizes.TableHeaderBold,
    TableHeaderLabel: fontSizes.TableHeaderLabel,
    TableFooterLabel: fontSizes.TableFooterLabel,
    UnreadMessagesTag: fontSizes.UnreadMessagesTag,
    VASelector: fontSizes.VASelector,
    FooterText: fontSizes.FooterText,
    VeteranStatusCardHeaderPortraitBold: fontSizes.VeteranStatusCardHeaderPortraitBold,
    VeteranStatusCardHeaderLandscapeBold: fontSizes.VeteranStatusCardHeaderLandscapeBold,
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
