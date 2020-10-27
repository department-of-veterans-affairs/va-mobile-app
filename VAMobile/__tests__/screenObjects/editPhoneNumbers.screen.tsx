import AppScreen from './app.screen'

const SELECTORS = {
  EDIT_NUMBER_SCREEN: '~Edit-number-screen',
}

class EditPhoneNumbersScreen extends AppScreen {
  constructor() {
    super(SELECTORS.EDIT_NUMBER_SCREEN)
  }
}

export default new EditPhoneNumbersScreen()
