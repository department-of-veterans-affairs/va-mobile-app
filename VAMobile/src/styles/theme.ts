export type VATextColors = {
  navBar: string
  primary: string
  primaryContrast: string
  primaryContrastDisabled: string
  secondary: string
  link: string
  error: string
  placeholder: string
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
  checkboxEnabledPrimary: string
  checkboxDisabled: string
  checkboxDisabledContrast: string
}

export type VATypographyThemeVariants = {
  BitterBoldHeading: string
  MobileBody: string
  MobileBodyBold: string
  TableHeaderBold: string
  TableHeaderLabel: string
  TableFooterLabel: string
  MobileBodyLink: string
}

export type VABackgroundColors = {
  main: string
  textBox: string
  buttonList: string
  segmentedController: string
  shadow: string
}

export type VABorderColors = {
  primary: string
  secondary: string
}

export type VATheme = {
  colors: {
    background: VABackgroundColors
    border: VABorderColors
    icon: VAIconColors
    text: VATextColors
    ctaButton: {
      background: string
      text: string
    }
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
  dimensions: {
    borderWidth: string
    gutter: string
    textIconMargin: string
    textXPadding: string
    contentMarginTop: string
    contentMarginBottom: string
    marginBetween: string
    cardPaddingY: string
    cardMargin: string
  }
  fontFace: {
    regular: string
    bold: string
    altBold: string
  }
  typography: VATypographyThemeVariants
}
