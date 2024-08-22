import { ColorSchemeTypes } from './themes/standardTheme'

export type VAButtonBackgroundColors = {
  buttonPrimary: string
  buttonPrimaryActive: string
  buttonSecondary: string
  buttonSecondaryActive: string
  buttonDisabled: string
  buttonSecondaryDisabled: string
  buttonDestructive: string
  buttonDestructiveActive: string
  buttonWhite: string
  buttonWhiteActive: string
  brandedPrimary: string
  brandedPrimaryActive: string
  overFlowMenuButton: string
  activityButton: string
  activityButtonActive: string
  announcementBanner: string
  crisisLine: string
  crisisLineActive: string
}

export type VAButtonBorderColors = {
  buttonSecondary: string
  buttonSecondaryActive: string
  buttonDestructive: string
  buttonDestructiveActive: string
  brandedPrimary: string
  brandedPrimaryActive: string
}

export type VAButtonTextColors = {
  buttonPrimary: string
  buttonSecondary: string
  buttonDisabled: string
  buttonDestructive: string
  buttonWhite: string
  brandedPrimary: string
}

export type VATextColors = {
  appVersionAndBuild: string
  descriptiveBackButton: string
  footerButton: string
  footerButtonActive: string
  navBar: string
  primary: string
  primaryContrast: string
  secondary: string
  link: string
  error: string
  placeholder: string
  checkboxDisabled: string
  claimPhase: string
  input: string
  inputFocused: string
  brandedPrimaryText: string
  segmentControllerActive: string
  segmentControllerInactive: string
  snackBarBtn: string
  snackBarTxt: string
  actionBar: string
  actionBarDisabled: string
  bodyText: string
  showAll: string
  defaultMenuItem: string
  warningTag: string
  statusDescription: string
  tabSelectorInactive: string
  tabSelectorActive: string
  closePanel: string
  labelTag: string
  textWithIconButton: string
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
  cernerPanel: string
  cernerFooter: string
}

export type VAIconColors = {
  footerButton: string
  footerButtonActive: string
  link: string
  nav: string
  largeNav: string
  deleteFill: string
  disclosure: string
  success: string
  error: string
  active: string
  inactive: string
  contrast: string
  expandCollapse: string
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
  backButton: string
  unreadMessage: string
  veteransCrisisLineArrow: string
  snackBarIcon: string
  defaultMenuItem: string
  statusInfoIcon: string
  infoIcon: string
  prescriptionHelper: string
  infoIconContrast: string
  radioDisabled: string
  tagInfoIcon: string
  transparent: string
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
  LargeNavButton: string
  LargeNavSubtext: string
  MobileBody: string
  MobileBodyBold: string
  MobileBodyLink: string
  MobileBodyTight: string
  NametagNumber: string
  ProfileScreenHeader: string
  SnackBarBtnText: string
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
  cernerPanelSubtext: string
  cernerPanelHeader: string
  cernerPanelFacility: string
  cernerFooterText: string
  MobileFooterLink: string
}

export type VABackgroundColors = {
  main: string
  largePanelHeader: string
  footerButtonActive: string
  textBox: string
  textBoxInactive: string
  list: string
  listActive: string
  segmentedController: string
  headerDropShadow: string
  shadow: string
  profileBanner: string
  completedPhase: string
  currentPhase: string
  upcomingPhase: string
  splashScreen: string
  loginScreen: string
  carousel: string
  unreadMessagesTag: string
  navHeader: string
  modalOverlay: string
  overlayOpacity: string
  pickerSelectedItem: string
  navButton: string
  brandedMainBackground: string
  carouselTab: string
  contentBox: string
  snackbar: string
  webviewControls: string
  pickerControls: string
  menu: string
  alertBox: string
  panelHeader: string
  modalButton: string
  tagBlue: string
  tagInactive: string
  tagYellow: string
  tagGreen: string
  veteranStatus: string
  veteranStatusHome: string
  linkRow: string
  skeletonLoader: string
  skeletonLoaderSecondary: string
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
  primaryDarkest: string
  photoAdd: string // todo rename photoAdd border color to be more abstract (talk to design)
  pickerAndInput: string
  focusedPickerAndInput: string
  confirmation: string
  footerButton: string
  menuDivider: string
  tabSelectorInactive: string
  tabSelectorActive: string
  photoUpload: string
  prescriptionDivider: string
  modalButton: string
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

export type VAListTagColors = {
  tagActive: string
  tagExpired: string
  tagSuspended: string
  tagInProgress: string
}

export type VAColorScheme = {
  background: VABackgroundColors
  border: VABorderColors
  icon: VAIconColors
  text: VATextColors
  buttonBackground: VAButtonBackgroundColors
  buttonText: VAButtonTextColors
  buttonBorder: VAButtonBorderColors
  selectCopyText: string
  listTag: VAListTagColors

  control: {
    tintColor: string
    switchOnTrack: string
    switchOffTrack: string
    switchOnThumb: string
    switchOffThumb: string
  }
  segmentedControl: {
    buttonActive: string
    buttonInactive: string
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
    snackBarBottomOffsetWithNav: number
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
    cernerPanelSubtext: VAFontSizes
    cernerPanelHeader: VAFontSizes
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
