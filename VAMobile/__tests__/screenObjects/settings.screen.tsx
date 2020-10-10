import AppScreen from './app.screen'

const SELECTORS = {
    SETTINGS_SCREEN: '~Settings-screen',
    SETTINGS_BACK: '~back'
}

class SettingsScreen extends AppScreen {
    constructor() {
        super(SELECTORS.SETTINGS_SCREEN)
    }

    get settingsBackButton() {
        return $(SELECTORS.SETTINGS_BACK)
    }

}

export default new SettingsScreen()
