import AppScreen from './app.screen'

const SELECTORS = {
  SETTINGS_MANAGE_ACCOUNT_SCREEN: '~manage-your-account-page',
}

class ManageYourAccountScreen extends AppScreen {
  constructor() {
    super(SELECTORS.SETTINGS_MANAGE_ACCOUNT_SCREEN)
  }
}

export default new ManageYourAccountScreen()
