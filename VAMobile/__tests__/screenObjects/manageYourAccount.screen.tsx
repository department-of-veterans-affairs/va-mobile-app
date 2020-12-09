import AppScreen from './app.screen'

const SELECTORS = {
  SETTINGS_MANAGE_ACCOUNT_SCREEN: '~Manage-your-account-screen',
}

class ManageYourAccountScreen extends AppScreen {
  constructor() {
    super(SELECTORS.SETTINGS_MANAGE_ACCOUNT_SCREEN)
  }
}

export default new ManageYourAccountScreen()
