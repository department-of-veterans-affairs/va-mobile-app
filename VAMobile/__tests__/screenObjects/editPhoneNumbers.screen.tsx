import AppScreen from './app.screen'

const SELECTORS = {
  EDIT_NUMBER_SCREEN: '~Edit-number-screen',
  EDIT_NUMBER_TEXT_INPUT_NUMBER: '~number-text-input',
  EDIT_NUMBER_TEXT_INPUT_EXTENSION: '~extension-text-input'
}

class EditPhoneNumbersScreen extends AppScreen {
  constructor() {
    super(SELECTORS.EDIT_NUMBER_SCREEN)
  }

  get numberTextInput() {
    return $(SELECTORS.EDIT_NUMBER_TEXT_INPUT_NUMBER)
  }

  get extensionTextInput() {
    return $(SELECTORS.EDIT_NUMBER_TEXT_INPUT_EXTENSION)
  }
}

export default new EditPhoneNumbersScreen()
