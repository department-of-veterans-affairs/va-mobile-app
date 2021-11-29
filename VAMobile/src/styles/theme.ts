export type VAButtonBackgroundColors = {
  buttonPrimary: string
  buttonPrimaryActive: string
  buttonSecondary: string
  buttonSecondaryActive: string
  buttonDisabled: string
  buttonSecondaryDisabled: string
  buttonImportant: string
  buttonImportantActive: string
  buttonWhite: string
  buttonWhiteActive: string
  brandedPrimary: string
  brandedPrimaryActive: string
}

export type VAButtonBorderColors = {
  buttonSecondary: string
  buttonSecondaryActive: string
  buttonImportant: string
  buttonImportantActive: string
  brandedPrimary: string
  brandedPrimaryActive: string
}

export type VAButtonTextColors = {
  buttonPrimary: string
  buttonSecondary: string
  buttonDisabled: string
  buttonImportant: string
  buttonWhite: string
  brandedPrimary: string
}

export type VATextColors = {
  footerButton: string
  footerButtonActive: string
  navBar: string
  primary: string
  primaryTitle: string
  primaryContrast: string
  primaryContrastDisabled: string
  secondary: string
  link: string
  error: string
  placeholder: string
  checkboxDisabled: string
  covid19Vaccinations: string
  claimPhase: string
  input: string
  inputFocused: string
  inputRequired: string
  brandedPrimaryText: string
}

export type VAIconColors = {
  footerButton: string
  footerButtonActive: string
  link: string
  nav: string
  largeNav: string
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
  dark: string
  covid19Vaccinations: string
  grayDark: string
  pagination: string
  chevronCollapsible: string
  chevronListItem: string
}

export type VATypographyThemeVariants = {
  BitterBoldHeading: string
  MobileBody: string
  MobileBodyBold: string
  UnreadMessagesTag: string
  SentMessagesReadTag: string
  TableHeaderBold: string
  TableHeaderLabel: string
  TableFooterLabel: string
  MobileBodyLink: string
  ClaimPhase: string
  ActionBar: string
  VASelector: string
  HelperText: string
}

export type VABackgroundColors = {
  main: string
  footerButtonActive: string
  textBox: string
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
  statusBar: string
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
  pickerAndInput: string
  focusedPickerAndInput: string
  confirmation: string
}

export type VAFontSizes = {
  fontSize: number
  lineHeight: number
}

export type VAAlertBoxColors = {
  cardBackground: string
  noCardBackground: string
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
  alertBox: VAAlertBoxColors
}

export type VATheme = {
  colors: VAColorScheme
  dimensions: {
    keyboardManagerDistanceFromTextField: number
    borderWidth: number
    focusedInputBorderWidth: number
    buttonBorderWidth: number
    gutter: number
    textIconMargin: number
    textXPadding: number
    contentMarginTop: number
    contentMarginBottom: number
    standardMarginBetween: number
    condensedMarginBetween: number
    cardPadding: number
    cardMargin: number
    buttonPadding: number
    alertBorderWidth: number
    alertPaddingY: number
    alertPaddingX: number
    listItemDecoratorMarginLeft: number
    noLettersPaddingY: number
    datePickerArrowsPaddingRight: number
    pickerLabelMargin: number
    checkboxLabelMargin: number
    navigationBarIconMarginTop: number
    touchableMinHeight: number
    textAreaHeight: number
    headerButtonMargin: number
    headerButtonPadding: number
    textInputLabelMarginBottom: number
    phaseIndicatorRightMargin: number
    phaseIndicatorDiameter: number
    phaseIndicatorBorderWidth: number
    phaseIndicatorIconWidth: number
    phaseIndicatorIconHeight: number
    bulletMargin: number
    textAndButtonLargeMargin: number
    fileUploadMargin: number
    biometricsPreferenceMarginTop: number
    carouselProgressDotsMargin: number
    headerHeight: number
    textInputMargin: number
    formMarginBetween: number
    tagCountMinWidth: number
    tagCountCurvedBorder: number
    tagCountTopPadding: number
    messagePhotoAttachmentMaxHeight: number
    messageIconLeftMargin: number
    maxNumMessageAttachments: number
    paginationButtonPadding: number
    pickerModalTopPadding: number
    pickerModalSelectedIconWidth: number
    pickerModalSelectedIconHeight: number
    messageSentReadLeftMargin: number
    syncLogoSpacing: number
    navBarHeight: number
    paginationTopPadding: number
    collapsibleIconMargin: number
    loginContentMarginBottom: number
    webviewReloadButtonHeight: number
    webviewReloadButtonSize: number
    webviewButtonSize: number
    webviewButtona11ySize: number
    errorLabelBottomMargin: number
    selectorWidth: number
    selectorHeight: number
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
    SentMessagesReadTag: VAFontSizes
    TableHeaderBold: VAFontSizes
    TableHeaderLabel: VAFontSizes
    TableFooterLabel: VAFontSizes
    MobileBodyLink: VAFontSizes
    ClaimPhase: VAFontSizes
    VASelector: VAFontSizes
  }
  typography: VATypographyThemeVariants
}
