import { ColorSchemeTypes } from './themes/standardTheme'

export type VAButtonBackgroundColors = {
  buttonPrimary: string
  buttonSecondaryDisabled: string
  overFlowMenuButton: string
  activityButton: string
  activityButtonActive: string
  announcementBanner: string
  crisisLine: string
  crisisLineActive: string
}

export type VATextColors = {
  appVersionAndBuild: string
  primary: string
  primaryContrast: string
  link: string
  error: string
  placeholder: string
  checkboxDisabled: string
  input: string
  inputFocused: string
  actionBar: string
  actionBarDisabled: string
  bodyText: string
  showAll: string
  labelTag: string
  textWithIconButtonInactive: string
  veteranStatus: string
  veteranStatusBranch: string
  veteranStatusProof: string
  webviewTitle: string
  crisisLineButton: string
  activityButton: string
  announcementBanner: string
  homeScreen: string
  profileScreen: string
  activityFooter: string
  categoryLandingError: string
  categoryLandingWarning: string
}

export type VAIconColors = {
  link: string
  largeNav: string
  deleteFill: string
  success: string
  error: string
  active: string
  inactive: string
  checkboxEnabledPrimary: string
  checkboxDisabled: string
  checkboxDisabledContrast: string
  spinner: string
  photoAdd: string
  pickerIcon: string
  pagination: string
  chevronCollapsible: string
  chevronListItem: string
  webviewReload: string
  unreadMessage: string
  defaultMenuItem: string
  radioDisabled: string
  tagInfoIcon: string
  activityButton: string
  announcementBanner: string
  inlineSpinner: string
  categoryLandingAlert: string
  linkRow: string
  largeNavButton: string
  ussf: string
}

export type VATypographyThemeVariants = {
  AboutYou: string
  ActionBar: string
  ActivityButtonHeader: string
  ActivityButtonSubtext: string
  ActivityFooter: string
  AnnouncementBannerTitle: string
  BitterBoldHeading: string
  BitterHeading: string
  CategoryLandingError: string
  CategoryLandingWarning: string
  ClaimPhase: string
  CrisisLineButton: string
  DescriptiveBackButton: string
  HomeScreen: string
  HomeScreenHeader: string
  HelperText: string
  HelperTextBold: string
  LabelTag: string
  LabResultHeader: string
  LargeNavButton: string
  LargeNavSubtext: string
  MobileBody: string
  MobileBodyBold: string
  MobileBodyLink: string
  MobileBodyTight: string
  NametagNumber: string
  ProfileScreenHeader: string
  TableHeaderBold: string
  TableHeaderLabel: string
  TableFooterLabel: string
  textWithIconButton: string
  UnreadMessagesTag: string
  VAHeader: string
  VASelector: string
  VeteranStatusBranch: string
  VeteranStatusProof: string
  webviewTitle: string
  MobileFooterLink: string
}

export type VABackgroundColors = {
  main: string
  largePanelHeader: string
  textBox: string
  textBoxInactive: string
  list: string
  listActive: string
  headerDropShadow: string
  profileBanner: string
  completedPhase: string
  currentPhase: string
  upcomingPhase: string
  splashScreen: string
  loginScreen: string
  carousel: string
  modalOverlay: string
  pickerSelectedItem: string
  navButton: string
  carouselTab: string
  contentBox: string
  webviewControls: string
  pickerControls: string
  menu: string
  alertBox: string
  tagBlue: string
  tagInactive: string
  tagYellow: string
  tagGreen: string
  veteranStatus: string
  veteranStatusHome: string
  linkRow: string
  skeletonLoader: string
  skeletonLoaderSecondary: string
  bullet: string
  carouselBullet: string
}

export type VABorderColors = {
  aboutYou: string
  primary: string
  secondary: string
  informational: string
  error: string
  warning: string
  phaseIndicatorCurrent: string
  phaseIndicatorUpcoming: string
  success: string
  photoAdd: string // todo rename photoAdd border color to be more abstract (talk to design)
  pickerAndInput: string
  focusedPickerAndInput: string
  menuDivider: string
  photoUpload: string
  divider: string
  tagBlue: string
  tagInactive: string
  tagYellow: string
  tagGreen: string
  veteranStatus: string
}

export type VAFontSizes = {
  fontSize: number
  lineHeight: number
  letterSpacing?: number
}

export type VAColorScheme = {
  background: VABackgroundColors
  border: VABorderColors
  icon: VAIconColors
  text: VATextColors
  buttonBackground: VAButtonBackgroundColors
  selectCopyText: string

  control: {
    switchOnTrack: string
    switchOffTrack: string
    switchOnThumb: string
  }
}

export type VATheme = {
  colors: VAColorScheme
  dimensions: {
    attachmentIconTopMargin: number
    borderWidth: number
    focusedInputBorderWidth: number
    buttonBorderWidth: number
    gutter: number
    textIconMargin: number
    contentMarginTop: number
    contentMarginBottom: number
    standardMarginBetween: number
    condensedMarginBetween: number
    tinyMarginBetween: number
    cardPadding: number
    buttonPadding: number
    alertBorderWidth: number
    listItemDecoratorMarginLeft: number
    touchableMinHeight: number
    textAndButtonLargeMargin: number
    headerHeight: number
    formMarginBetween: number
    tagMinWidth: number
    maxNumMessageAttachments: number
    navBarHeight: number
    paginationTopPadding: number
    snackBarBottomOffset: number
    chevronListItemWidth: number
    chevronListItemHeight: number
    linkRowChevronPaddingRight: number
    headerButtonSpacing: number
    headerLeftButtonFromTextPadding: number
    fullScreenNavigationBarOffset: number
    fullScreenContentButtonHeight: number
  }
  fontFace: {
    regular: string
    bold: string
    altBold: string
  }
  fontSizes: {
    ActivityButtonSubtext: VAFontSizes
    AnnouncementBannerTitle: VAFontSizes
    BitterHeading: VAFontSizes
    BitterBoldHeading: VAFontSizes
    CategoryLandingAlert: VAFontSizes
    ClaimPhase: VAFontSizes
    CrisisLineButton: VAFontSizes
    HelperText: VAFontSizes
    LabelTag: VAFontSizes
    MobileBody: VAFontSizes
    MobileBodyTight: VAFontSizes
    TableHeaderBold: VAFontSizes
    TableHeaderLabel: VAFontSizes
    TableFooterLabel: VAFontSizes
    UnreadMessagesTag: VAFontSizes
    VASelector: VAFontSizes
    FooterText: VAFontSizes
  }
  mode: ColorSchemeTypes
  paragraphSpacing: {
    spacing12FontSize: number
    spacing14FontSize: number
    spacing16FontSize: number
    spacing18FontSize: number
    spacing20FontSize: number
    spacing26FontSize: number
    spacing28FontSize: number
  }
  typography: VATypographyThemeVariants
}
