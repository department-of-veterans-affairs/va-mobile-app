import AppScreen from './app.screen'

const SELECTORS = {
  LETTERS_OVERVIEW_SCREEN: '~Letters-overview-screen',
  LETTERS_ADD_MAILING_ADDRESS: '~mailing-address-please-add-your-mailing-address',
}

class LettersOverviewScreen extends AppScreen {
  constructor() {
    super(SELECTORS.LETTERS_OVERVIEW_SCREEN)
  }

  get lettersMailingAddress() {
    return $(SELECTORS.LETTERS_ADD_MAILING_ADDRESS)
  }
}

export default new LettersOverviewScreen()
