import AppScreen from './app.screen'

const SELECTORS = {
  EDIT_NUMBER_SCREEN: '~home-phone: Edit-number-page',
  EDIT_NUMBER_CANCEL_BUTTON: '~cancel'
}

class EditHomePhoneNumberScreen extends AppScreen {
  constructor() {
    super(SELECTORS.EDIT_NUMBER_SCREEN)
  }

  get cancelButton() {
    return $(SELECTORS.EDIT_NUMBER_CANCEL_BUTTON)
  }
}

export default new EditHomePhoneNumberScreen()
