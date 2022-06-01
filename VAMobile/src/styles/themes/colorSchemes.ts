import colors from './VAColors'
export const primaryTextColor = colors.grayDark

export const lightTheme = {
  background: {
    main: colors.grayLightest,
    footerButtonActive: colors.primaryDarkest,
    textBox: colors.white,
    textBoxInactive: colors.white,
    list: colors.white,
    listActive: colors.primaryAltLightest,
    segmentedController: colors.grayLighter,
    shadow: colors.grayMedium,
    profileBanner: colors.primary,
    ctaButton: colors.crisisLineRed,
    covid19Vaccinations: colors.primary,
    completedPhase: colors.greenDarker,
    currentPhase: colors.primary,
    upcomingPhase: colors.grayLight,
    splashScreen: colors.primaryDarker,
    carousel: colors.primaryDark,
    covid19VaccinationsActive: colors.primaryDarkest,
    unreadMessagesTag: colors.grayDark,
    navHeader: colors.primaryDarker,
    modalOverlay: colors.base,
    pickerSelectedItem: colors.primaryAltLightest,
    navButton: colors.toolbarBackgroundGray,
    brandedMainBackground: colors.grayLightest,
    carouselTab: colors.white,
    contentBox: colors.white,
    snackbar: colors.snackBarBlack,
    webviewControls: colors.grayLightest,
    pickerControls: colors.grayLightest,
    menu: colors.white,
    alertBox: colors.white,
  },
  border: {
    primary: colors.grayLight,
    secondary: colors.gray,
    informational: colors.primaryAltDark,
    error: colors.secondaryDark,
    warning: colors.warningMessage,
    phaseIndicatorCurrent: colors.primary,
    phaseIndicatorUpcoming: colors.grayLight,
    success: colors.green,
    primaryDarkest: colors.primaryDarkest,
    photoAdd: colors.primary,
    pickerAndInput: colors.gray,
    focusedPickerAndInput: colors.primaryDarker,
    confirmation: colors.goldLight,
    footerButton: colors.grayLight,
    menuDivider: colors.grayLight,
    trackingCard: colors.grayDark,
    trackingCardActive: colors.grayLight,
    prescriptionDivider: colors.grayLighter,
  },
  icon: {
    footerButton: colors.primary,
    footerButtonActive: colors.white,
    link: colors.primary, //'#0071bb',
    nav: colors.linkDefault, //'#004795',
    largeNav: colors.primary,
    deleteFill: colors.base, //212121
    disclosure: colors.grayLight,
    success: colors.green, //'#2E8540',
    error: colors.secondaryDark, //'#CD2026',
    active: colors.primary,
    inactive: colors.primary,
    contrast: colors.white,
    expandCollapse: colors.black,
    checkboxEnabledPrimary: colors.primary,
    checkboxDisabled: colors.grayMedium,
    checkboxDisabledContrast: colors.white,
    spinner: colors.grayMedium,
    covid19Vaccinations: colors.white,
    photoAdd: colors.primary,
    pickerIcon: colors.grayDark,
    pagination: colors.white,
    chevronCollapsible: colors.primary,
    chevronListItem: colors.primary,
    webviewReload: colors.white,
    backButton: colors.white,
    defaultMenuItem: colors.grayDark,
    unreadMessage: colors.primary,
    buttonWithIcon: colors.black,
    infoIcon: colors.grayMedium,
    veteransCrisisLineArrow: colors.grayLightest,
    snackBarIcon: colors.grayLighter,
  },
  text: {
    footerButton: colors.primary,
    footerButtonActive: colors.white,
    navBar: colors.white,
    primary: primaryTextColor,
    primaryContrast: colors.grayLightest,
    secondary: colors.black,
    error: colors.secondaryDark, //'#CD2026',
    link: colors.linkDefault,
    placeholder: colors.grayMedium, //#757575
    checkboxDisabled: colors.grayMedium,
    covid19Vaccinations: colors.white,
    claimPhase: colors.white,
    input: colors.black,
    inputFocused: colors.black,
    brandedPrimaryText: colors.grayDark,
    segmentControllerActive: primaryTextColor,
    segmentControllerInactive: primaryTextColor,
    snackBarBtn: colors.darkmodeLightBlue,
    backButton: colors.white,
    snackBarText: colors.white,
    showAll: colors.primary,
    snackBarTxt: colors.grayLighter,
    actionBar: colors.white,
    actionBarDisabled: colors.grayLight,
    defaultMenuItem: primaryTextColor,
    bodyText: primaryTextColor,
  },
  buttonBackground: {
    buttonPrimary: colors.primary,
    buttonPrimaryActive: colors.primaryDarkest,
    buttonSecondary: colors.white,
    buttonSecondaryActive: colors.primaryAltLightest,
    buttonImportant: colors.white,
    buttonImportantActive: colors.white,
    buttonDisabled: colors.grayMedium,
    buttonSecondaryDisabled: colors.grayLight,
    buttonWhite: colors.white,
    buttonWhiteActive: colors.whiteWith70PercentOpacity,
    brandedPrimary: colors.primary,
    brandedPrimaryActive: colors.primaryDarkest,
    overFlowMenuButton: colors.primaryAltLightest,
  },
  buttonText: {
    buttonPrimary: colors.white,
    buttonSecondary: colors.primary,
    buttonDisabled: colors.white,
    buttonImportant: colors.secondaryDark,
    buttonWhite: colors.primaryDarker,
    brandedPrimary: colors.white,
  },
  buttonBorder: {
    buttonSecondary: colors.primary,
    buttonSecondaryActive: colors.primary,
    buttonImportant: colors.secondaryDark,
    buttonImportantActive: colors.secondaryDarkest,
    brandedPrimary: colors.primary,
    brandedPrimaryActive: colors.primaryDarkest,
  },
  control: {
    tintColor: colors.primary,
    switchOnTrack: colors.primary,
    switchOffTrack: colors.grayLight,
    switchOnThumb: colors.white,
    switchOffThumb: colors.grayLightest,
  },
  segmentedControl: {
    buttonActive: colors.white,
    buttonInactive: colors.grayLighter,
  },
  selectCopyText: colors.primaryAltLight,
  listTag: {
    tagActive: colors.primary,
    tagExpired: colors.grayMedium,
    tagSuspended: colors.gold,
    tagInProgress: colors.greenDarker,
  },
}

export const darkTheme = {
  background: {
    main: colors.darkmodeGrayDark,
    footerButtonActive: colors.primaryDarkest,
    textBox: colors.base,
    textBoxInactive: colors.base,
    list: colors.base,
    listActive: colors.base,
    segmentedController: colors.darkmodeGrayWarmDark,
    shadow: colors.grayMedium,
    profileBanner: colors.primaryDarker2,
    ctaButton: colors.crisisLineRed,
    covid19Vaccinations: colors.primary,
    completedPhase: colors.greenLight,
    currentPhase: colors.primaryDarker2,
    upcomingPhase: colors.darkmodeBorder,
    splashScreen: colors.primaryDarker,
    carousel: colors.primaryDark,
    covid19VaccinationsActive: colors.primaryDarkest,
    unreadMessagesTag: colors.grayMedium,
    navHeader: colors.base,
    modalOverlay: colors.base,
    pickerSelectedItem: colors.darkmodeBorder,
    navButton: colors.base,
    brandedMainBackground: colors.grayLightest,
    carouselTab: colors.white,
    contentBox: colors.base,
    snackbar: colors.grayLightest,
    webviewControls: colors.base,
    pickerControls: colors.darkmodeGrayWarmDark,
    alertBox: colors.base,
    menu: colors.darkmodeGrayWarmDark,
  },
  border: {
    primary: colors.darkmodeBorder,
    secondary: colors.darkmodeBorder,
    informational: colors.darkmodeLightBlue,
    error: colors.darkmodeRed,
    warning: colors.warningMessage,
    phaseIndicatorCurrent: colors.primaryDarker2,
    phaseIndicatorUpcoming: colors.darkmodeBorder,
    success: colors.greenLight,
    primaryDarkest: colors.grayLight,
    photoAdd: colors.darkmodeLightBlue,
    pickerAndInput: colors.grayLight,
    focusedPickerAndInput: colors.gold,
    confirmation: colors.gold,
    footerButton: colors.darkmodeBorder,
    menuDivider: colors.darkmodeBorder,
    trackingCard: colors.darkmodeBorder,
    trackingCardActive: colors.grayLight,
    prescriptionDivider: colors.darkmodeBorder,
  },
  icon: {
    footerButton: colors.darkmodeLightBlue,
    footerButtonActive: colors.darkmodeLightBlue,
    link: colors.darkmodeLightBlue,
    nav: colors.darkmodeLightBlue,
    largeNav: colors.darkmodeLightBlue,
    deleteFill: colors.base, //212121
    disclosure: colors.grayLight,
    success: colors.green,
    error: colors.darkmodeRed,
    active: colors.darkmodeLightBlue,
    inactive: colors.grayLight,
    contrast: colors.grayLightest,
    expandCollapse: colors.black,
    checkboxEnabledPrimary: colors.primary,
    checkboxDisabled: colors.grayMedium,
    checkboxDisabledContrast: colors.white,
    spinner: colors.grayMedium,
    covid19Vaccinations: colors.white,
    photoAdd: colors.darkmodeLightBlue,
    pickerIcon: colors.grayLight,
    pagination: colors.white,
    chevronCollapsible: colors.darkmodeLightBlue,
    chevronListItem: colors.darkmodeLightBlue,
    webviewReload: colors.darkmodeLightBlue,
    backButton: colors.darkmodeLightBlue,
    defaultMenuItem: colors.grayLighter,
    unreadMessage: colors.darkmodeLightBlue,
    buttonWithIcon: colors.grayLightest,
    infoIcon: colors.grayLight,
    veteransCrisisLineArrow: colors.grayLightest,
    snackBarIcon: colors.grayDark,
  },
  text: {
    footerButton: colors.darkmodeLightBlue,
    footerButtonActive: colors.darkmodeLightBlue,
    navBar: colors.grayLightest,
    primary: colors.grayLightest,
    primaryContrast: colors.grayLightest,
    secondary: colors.grayLight,
    error: colors.darkmodeRed,
    link: colors.darkmodeLightBlue,
    placeholder: colors.grayLight,
    checkboxDisabled: colors.grayMedium,
    covid19Vaccinations: colors.white,
    claimPhase: colors.white,
    input: colors.grayLight,
    inputFocused: colors.grayLightest,
    brandedPrimaryText: colors.grayDark,
    segmentControllerActive: colors.grayLightest,
    segmentControllerInactive: colors.grayLighter,
    snackBarBtn: colors.primary,
    snackBarTxt: colors.grayDark,
    actionBar: colors.darkmodeLightBlue,
    actionBarDisabled: colors.grayLight,
    defaultMenuItem: colors.grayLighter,
    bodyText: colors.grayLighter,
    showAll: colors.darkmodeLightBlue,
  },
  buttonBackground: {
    buttonPrimary: colors.primaryDarker2,
    buttonPrimaryActive: colors.darkmodeLightBlue,
    buttonSecondary: colors.base,
    buttonSecondaryActive: colors.base,
    buttonImportant: colors.darkmodeRed,
    buttonImportantActive: colors.darkmodeRed,
    buttonDisabled: colors.grayMedium,
    buttonSecondaryDisabled: colors.darkmodeBorder,
    buttonWhite: colors.white,
    buttonWhiteActive: colors.whiteWith70PercentOpacity,
    brandedPrimary: colors.primary,
    brandedPrimaryActive: colors.primaryDarkest,
    overFlowMenuButton: colors.darkmodeBorder,
  },
  buttonText: {
    buttonPrimary: colors.grayLightest,
    buttonSecondary: colors.darkmodeLightBlue,
    buttonDisabled: colors.white,
    buttonImportant: colors.grayLightest,
    buttonWhite: colors.primaryDarker,
    brandedPrimary: colors.white,
  },
  buttonBorder: {
    buttonSecondary: colors.darkmodeLightBlue,
    buttonSecondaryActive: colors.darkmodeLightBlue,
    buttonImportant: colors.darkmodeRed,
    buttonImportantActive: colors.darkmodeRed,
    brandedPrimary: colors.primary,
    brandedPrimaryActive: colors.primaryDarkest,
  },
  control: {
    tintColor: colors.darkmodeLightBlue,
    switchOnTrack: colors.darkmodeLightBlue,
    switchOffTrack: colors.darkmodeBorder,
    switchOnThumb: colors.grayLightest,
    switchOffThumb: colors.grayLightest,
  },
  segmentedControl: {
    buttonActive: colors.gray,
    buttonInactive: colors.darkmodeGrayWarmDark,
  },
  selectCopyText: colors.primaryAltLight,
  listTag: {
    tagActive: colors.primaryDarker2,
    tagExpired: colors.darkmodeBorder,
    tagSuspended: colors.gold,
    tagInProgress: colors.greenDarker,
  },
}
