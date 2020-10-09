import AppScreen from './app.screen'

const SELECTORS = {
    PROFILE_SCREEN: '~Profile-screen',
    PROFILE_BANNER: '~Profile-banner',
    PROFILE_BANNER_SEAL: '~Profile-banner-seal',
    PROFILE_BANNER_NAME: '~Profile-banner-name',
    PROFILE_BANNER_BRANCH: '~Profile-banner-branch',
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

    get profileSettingsButton() {
        return $(SELECTORS.PROFILE_SETTINGS_BUTTON)
    }
}

export default new ProfileScreen()
