import AppScreen from './app.screen'

const SELECTORS = {
    SETTINGS_SCREEN: '~Settings-page',
    SETTINGS_MANAGE_ACCOUNT_BUTTON: '~manage-your-account',
    SETTINGS_SHARE_APP_BUTTON: '~share-the-app',
    SETTINGS_PRIVACY_POLICY_BUTTON: '~privacy-policy',
    SETTINGS_DEBUG_BUTTON: '~developer-screen',
    SETTINGS_SIGNOUT_BUTTON: '~Sign out',
    SETTINGS_CONFIRM_BUTTON: '~Confirm',
}

class SettingsScreen extends AppScreen {
    constructor() {
        super(SELECTORS.SETTINGS_SCREEN)
    }

    get settingsManageAccountButton() {
        return $(SELECTORS.SETTINGS_MANAGE_ACCOUNT_BUTTON)
    }

    get settingsShareAppButton() {
        return $(SELECTORS.SETTINGS_SHARE_APP_BUTTON)
    }

    get settingsPrivacyPolicyButton() {
        return $(SELECTORS.SETTINGS_PRIVACY_POLICY_BUTTON)
    }

    get settingsDebugButton() {
        return $(SELECTORS.SETTINGS_DEBUG_BUTTON)
    }

    get settingsSignoutButton() {
        return $(SELECTORS.SETTINGS_SIGNOUT_BUTTON)
    }

    get settingsConfirmButton() {
        return $(SELECTORS.SETTINGS_CONFIRM_BUTTON)
    }
}

export default new SettingsScreen()
