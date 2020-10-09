import AppScreen from './app.screen'

const SELECTORS = {
    PROFILE_SCREEN: '~Profile-screen',
    PROFILE_BANNER: '~Profile-banner',
    PROFILE_BANNER_SEAL: '~Profile-banner-seal',
    PROFILE_BANNER_NAME: '~Profile-banner-name',
    PROFILE_BANNER_BRANCH: '~Profile-banner-branch',
    PROFILE_PERSONAL_INFO_BUTTON: '~personal-and-contact-information',
    PROFILE_MILITARY_BUTTON: '~military-information',
    PROFILE_DIRECT_DEPOSIT_BUTTON: '~direct-deposit',
    PROFILE_LETTERS_DOCS_BUTTON: '~va-letters-and-documents',
    PROFILE_SETTINGS_BUTTON: '~settings'
}

class ProfileScreen extends AppScreen {
    constructor() {
        super(SELECTORS.PROFILE_SCREEN)
    }

    get profileBanner() {
        return $(SELECTORS.PROFILE_BANNER)
    }

    get profileBannerSeal() {
        return $(SELECTORS.PROFILE_BANNER_SEAL)
    }

    get profileBannerName() {
        return $(SELECTORS.PROFILE_BANNER_NAME)
    }

    get profileBannerBranch() {
        return $(SELECTORS.PROFILE_BANNER_BRANCH)
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
