import AppScreen from './app.screen'

const SELECTORS = {
    SETTINGS_SCREEN: '~Settings-screen',
    SETTINGS_MANAGE_ACCOUNT_BUTTON: '~manage-your-account',
    SETTINGS_TOUCH_ID_BUTTON: '~touch-id',
    SETTINGS_SHARE_APP_BUTTON: '~share-the-app',
    SETTINGS_PRIVACY_POLICY_BUTTON: '~privacy-policy',
    SETTINGS_BACK: '~back'
}

class SettingsScreen extends AppScreen {
    constructor() {
        super(SELECTORS.SETTINGS_SCREEN)
    }

    get settingsManageAccountButton() {
        return $(SELECTORS.SETTINGS_MANAGE_ACCOUNT_BUTTON)
    }

    get settingsTouchIDButton() {
        return $(SELECTORS.SETTINGS_TOUCH_ID_BUTTON)
    }

    get settingsShareAppButton() {
        return $(SELECTORS.SETTINGS_SHARE_APP_BUTTON)
    }

    get settingsPrivacyPolicyButton() {
        return $(SELECTORS.SETTINGS_PRIVACY_POLICY_BUTTON)
    }

    get settingsBackButton() {
        return $(SELECTORS.SETTINGS_BACK)
    }

}

export default new SettingsScreen()
