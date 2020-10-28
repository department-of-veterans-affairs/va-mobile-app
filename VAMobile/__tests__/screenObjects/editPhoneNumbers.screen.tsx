import AppScreen from './app.screen'

const SELECTORS = {
  EDIT_NUMBER_SCREEN: '~Edit-number-screen',
  EDIT_NUMBER_CANCEL_BUTTON: '~cancel'
}

class EditPhoneNumbersScreen extends AppScreen {
  constructor() {
    super(SELECTORS.EDIT_NUMBER_SCREEN)
  }

  get cancelButton() {
    return $(SELECTORS.EDIT_NUMBER_CANCEL_BUTTON)
  }
}

export default new EditPhoneNumbersScreen()
