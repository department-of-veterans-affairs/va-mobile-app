import AppScreen from './app.screen'

const SELECTORS = {
  EDIT_EMAIL_SCREEN: '~Email: Edit-email-page',
  EDIT_EMAIL_CANCEL_BUTTON: '~cancel',
}

class EditEmailScreen extends AppScreen {
  constructor() {
    super(SELECTORS.EDIT_EMAIL_SCREEN)
  }

  get cancelButton() {
    return $(SELECTORS.EDIT_EMAIL_CANCEL_BUTTON)
  }
}

export default new EditEmailScreen()
