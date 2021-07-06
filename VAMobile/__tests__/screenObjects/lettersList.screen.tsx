import AppScreen from './app.screen'

const SELECTORS = {
  LETTERS_LIST_SCREEN: '~Letters-list-page',
  LETTERS_LIST_BENEFIT_SUMMARY_SERVICE_VERIFICATION: '~benefit-summary-and-service-verification-letter',
  LETTERS_LIST_SERVICE_VERIFICATION: '~service-verification-letter',
  LETTERS_LIST_COMMISSARY: '~commissary-letter',
  LETTERS_LIST_CIVIL_SERVICE: '~civil-service-preference-letter',
  LETTERS_LIST_BENEFIT_VERIFICATION: '~benefit-verification-letter',
  LETTERS_LIST_PROOF_OF_SERVICE: '~proof-of-service-card',
  LETTERS_LIST_PROOF_OF_CREDITABLE_PRESCRIPTION: '~proof-of-creditable-prescription-drug-coverage-letter',
  LETTERS_LIST_PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE: '~proof-of-minimum-essential-coverage-letter',
  LETTERS_NO_LETTERS: '~Letters: No-letters-page',
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

  get benefitVerification() {
    return $(SELECTORS.LETTERS_LIST_BENEFIT_VERIFICATION)
  }

  get proofOfService() {
    return $(SELECTORS.LETTERS_LIST_PROOF_OF_SERVICE)
  }

  get proofOfCreditablePrescription() {
    return $(SELECTORS.LETTERS_LIST_PROOF_OF_CREDITABLE_PRESCRIPTION)
  }

  get proofOfMinCoverage() {
    return $(SELECTORS.LETTERS_LIST_PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE)
  }

  get noLetters() {
    return $(SELECTORS.LETTERS_NO_LETTERS)
  }
}

export default new LettersListScreen()
