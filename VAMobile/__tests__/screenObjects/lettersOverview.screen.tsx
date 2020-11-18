import AppScreen from './app.screen'

const SELECTORS = {
  LETTERS_OVERVIEW_SCREEN: '~Letters-overview-screen',
  LETTERS_ADD_MAILING_ADDRESS: '~mailing-address-please-add-your-mailing-address',
  LETTERS_OVERVIEW_VIEW_LETTERS: '~view-letters-button'
}

class LettersOverviewScreen extends AppScreen {
  constructor() {
    super(SELECTORS.LETTERS_OVERVIEW_SCREEN)
  }

  get lettersMailingAddress() {
    return $(SELECTORS.LETTERS_ADD_MAILING_ADDRESS)
  }

  get lettersOverviewViewLettersButton() {
    return $(SELECTORS.LETTERS_OVERVIEW_VIEW_LETTERS)
  }
}

export default new LettersOverviewScreen()
