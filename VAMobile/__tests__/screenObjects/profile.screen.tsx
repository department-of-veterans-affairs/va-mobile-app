import AppScreen from './app.screen'

const SELECTORS = {
    PROFILE_SCREEN: '~Profile-page',
    PROFILE_PERSONAL_INFO_BUTTON: '~personal-and-contact-information',
    PROFILE_MILITARY_BUTTON: '~military-information',
    PROFILE_DIRECT_DEPOSIT_BUTTON: '~direct-deposit-information',
    PROFILE_LETTERS_DOCS_BUTTON: '~V-A letters and documents',
    PROFILE_SETTINGS_BUTTON: '~settings'
}

class ProfileScreen extends AppScreen {
    constructor() {
        super(SELECTORS.PROFILE_SCREEN)
    }

    get profilePersonalInfoButton() {
        return $(SELECTORS.PROFILE_PERSONAL_INFO_BUTTON)
    }

    get profileMilitaryInfoButton() {
        return $(SELECTORS.PROFILE_MILITARY_BUTTON)
    }

    get profileDirectDepositButton() {
        return $(SELECTORS.PROFILE_DIRECT_DEPOSIT_BUTTON)
    }

    get profileLettersAndDocsButton() {
        return $(SELECTORS.PROFILE_LETTERS_DOCS_BUTTON)
    }

    get profileSettingsButton() {
        return $(SELECTORS.PROFILE_SETTINGS_BUTTON)
    }
}

export default new ProfileScreen()
