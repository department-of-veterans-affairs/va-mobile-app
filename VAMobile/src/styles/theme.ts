export type VATextColors = {
  navBar: string
  primary: string
  primaryContrast: string
  primaryContrastDisabled: string
  secondary: string
  link: string
  error: string
  placeholder: string
  checkboxDisabled: string
  covid19Vaccinations: string
  claimPhase: string
  altButton: string
}

export type VAIconColors = {
  link: string
  nav: string
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
}

export type VATypographyThemeVariants = {
  BitterBoldHeading: string
  MobileBody: string
  MobileBodyBold: string
  TableHeaderBold: string
  TableHeaderLabel: string
  TableFooterLabel: string
  MobileBodyLink: string
  ClaimPhase: string
  ActionBar: string
  VASelector: string
}

export type VABackgroundColors = {
  main: string
  textBox: string
  list: string
  segmentedController: string
  shadow: string
  button: string
  activeButton: string
  disabledButton: string
  profileBanner: string
  ctaButton: string
  covid19Vaccinations: string
  completedPhase: string
  currentPhase: string
  upcomingPhase: string
  splashScreen: string
  carousel: string
  covid19VaccinationsActive: string
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
}

export type VAFontSizes = {
  fontSize: number
  lineHeight: number
}

export type VAAlertBoxColors = {
  cardBackground: string
  noCardBackground: string
}

export type VATheme = {
  colors: {
    background: VABackgroundColors
    border: VABorderColors
    icon: VAIconColors
    text: VATextColors

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
  dimensions: {
    borderWidth: number
    buttonBorderWidth: number
    gutter: number
    textIconMargin: number
    textXPadding: number
    contentMarginTop: number
    contentMarginBottom: number
    marginBetween: number
    cardPadding: number
    cardMargin: number
    buttonPadding: number
    alertBorderWidth: number
    alertPaddingY: number
    alertPaddingX: number
    listItemDecoratorMarginLeft: number
    noLettersPaddingY: number
    datePickerArrowsPaddingRight: number
    datePickerArrowsPaddingTopAndroid: number
    pickerLabelMargin: number
    checkboxLabelMargin: number
    navigationBarIconMarginTop: number
    touchableMinHeight: number
    marginBetweenCards: number
    marginBetweenButtons: number
    headerButtonMargin: number
    headerButtonPadding: number
    titleHeaderAndElementMargin: number
    textInputLabelMarginBottom: number
    phaseIndicatorRightMargin: number
    phaseIndicatorDiameter: number
    phaseIndicatorBorderWidth: number
    phaseIndicatorIconWidth: number
    phaseIndicatorIconHeight: number
    bulletMargin: number
    inputAndPickerLabelWidth: number
    androidPickerPaddingL: number
    textAndButtonLargeMargin: number
    fileUploadMargin: number
    androidPickerPaddingLMultiLine: number
    singleLinePickerHeight: number
    biometricsPreferenceMarginTop: number
    singleLineTextInputHeight: number
    carouselProgressDotsMargin: number
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
    TableHeaderBold: VAFontSizes
    TableHeaderLabel: VAFontSizes
    TableFooterLabel: VAFontSizes
    MobileBodyLink: VAFontSizes
    ClaimPhase: VAFontSizes
    VASelector: VAFontSizes
  }
  typography: VATypographyThemeVariants
}
