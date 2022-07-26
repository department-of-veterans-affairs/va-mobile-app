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
  covid19Vaccinations: string
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
  defaultMenuItem: string
  warningTag: string
  tabSelectorInactive: string
  tabSelectorActive: string
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
  covid19Vaccinations: string
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
}

export type VATypographyThemeVariants = {
  BitterBoldHeading: string
  MobileBody: string
  MobileBodyBold: string
  UnreadMessagesTag: string
  TableHeaderBold: string
  TableHeaderLabel: string
  TableFooterLabel: string
  MobileBodyLink: string
  ClaimPhase: string
  ActionBar: string
  VASelector: string
  HelperText: string
  HelperTextBold: string
  SnackBarBtnText: string
  LabelTag: string
  LabelTagBold: string
}

export type VABackgroundColors = {
  main: string
  footerButtonActive: string
  textBox: string
  textBoxInactive: string
  list: string
  listActive: string
  segmentedController: string
  shadow: string
  profileBanner: string
  ctaButton: string
  covid19Vaccinations: string
  completedPhase: string
  currentPhase: string
  upcomingPhase: string
  splashScreen: string
  carousel: string
  covid19VaccinationsActive: string
  unreadMessagesTag: string
  navHeader: string
  modalOverlay: string
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
  warningTag: string
  inactiveTag: string
  activeTag: string
}

export type VABorderColors = {
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
}

export type VAFontSizes = {
  fontSize: number
  lineHeight: number
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
    headerButtonSpacing: number
    headerLeftButtonFromTextPadding: number
  }
  fontFace: {
    regular: string
    bold: string
    altBold: string
  }
  fontSizes: {
    BitterBoldHeading: VAFontSizes
    MobileBody: VAFontSizes
    MobileBodyBold: VAFontSizes
    UnreadMessagesTag: VAFontSizes
    TableHeaderBold: VAFontSizes
    TableHeaderLabel: VAFontSizes
    TableFooterLabel: VAFontSizes
    MobileBodyLink: VAFontSizes
    ClaimPhase: VAFontSizes
    VASelector: VAFontSizes
    LabelTag: VAFontSizes
    LabelTagBold: VAFontSizes
    HelperText: VAFontSizes
    HelperTextBold: VAFontSizes
  }
  typography: VATypographyThemeVariants
}
