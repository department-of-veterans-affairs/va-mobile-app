import AppScreen from './app.screen'

const SELECTORS = {
  LETTERS_LIST_SCREEN: '~Letters-list-screen',
  LETTERS_LIST_BENEFIT_SUMMARY_SERVICE_VERIFICATION: '~benefit-summary-and-service-verification-letter',
  LETTERS_LIST_SERVICE_VERIFICATION: '~service-verification-letter',
  LETTERS_LIST_COMMISSARY: '~commissary-letter',
  LETTERS_LIST_CIVIL_SERVICE: '~civil-service-preference-letter',
  LETTERS_NO_LETTERS: '~No-letters-screen',
}

class LettersListScreen extends AppScreen {
  constructor() {
    super(SELECTORS.LETTERS_LIST_SCREEN)
  }

  get benefitSummaryAndServiceVerification() {
    return $(SELECTORS.LETTERS_LIST_BENEFIT_SUMMARY_SERVICE_VERIFICATION)
  }

  get serviceVerification() {
    return $(SELECTORS.LETTERS_LIST_SERVICE_VERIFICATION)
  }

  get commissary() {
    return $(SELECTORS.LETTERS_LIST_COMMISSARY)
  }

  get civilService() {
    return $(SELECTORS.LETTERS_LIST_CIVIL_SERVICE)
  }

  get noLetters() {
    return $(SELECTORS.LETTERS_NO_LETTERS)
  }
}

export default new LettersListScreen()
