import AppScreen from './app.screen'

const SELECTORS = {
  LETTERS_LIST_SCREEN: '~Letters-list-screen',
  LETTERS_LIST_BENEFIT_SUMMARY_SERVICE_VERIFICATION: '~benefit-summary-and-service-verification-letter'
};

class LettersListScreen extends AppScreen {
  constructor() {
    super(SELECTORS.LETTERS_LIST_SCREEN)
  }

  get benefitSummaryAndServiceVerification() {
    return $(SELECTORS.LETTERS_LIST_BENEFIT_SUMMARY_SERVICE_VERIFICATION)
  }
}

export default new LettersListScreen()
