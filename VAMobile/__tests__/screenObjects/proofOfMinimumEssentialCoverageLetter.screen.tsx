import AppScreen from './app.screen'

const SELECTORS = {
  PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE_LETTER: '~Letters: proof-of-minimum-essential-coverage-letter-page',
};

class ProofOfMinimumEssentialCoverageLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE_LETTER)
  }
}

export default new ProofOfMinimumEssentialCoverageLetterScreen()
