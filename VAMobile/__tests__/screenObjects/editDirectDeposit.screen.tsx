import AppScreen from './app.screen'

const SELECTORS = {
  EDIT_DIRECT_DEPOSIT_SCREEN: '~Direct-deposit: Edit-direct-deposit-page',
  EDIT_DIRECT_DEPOSIT_CANCEL_BUTTON: '~cancel',
}

class EditDirectDepositScreen extends AppScreen {
  constructor() {
    super(SELECTORS.EDIT_DIRECT_DEPOSIT_SCREEN)
  }

  get cancelButton() {
    return $(SELECTORS.EDIT_DIRECT_DEPOSIT_CANCEL_BUTTON)
  }
}

export default new EditDirectDepositScreen()
