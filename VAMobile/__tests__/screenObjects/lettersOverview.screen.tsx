import AppScreen from './app.screen'

const SELECTORS = {
  LETTERS_OVERVIEW_SCREEN: '~Letters-page',
  LETTERS_ADD_MAILING_ADDRESS: '~mailing-address',
  LETTERS_OVERVIEW_VIEW_LETTERS: '~View letters',
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
