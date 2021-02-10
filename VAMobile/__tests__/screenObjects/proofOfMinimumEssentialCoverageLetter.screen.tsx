import AppScreen from './app.screen'

const SELECTORS = {
  PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE_LETTER: '~Letters: Proof of Minimum Essential Coverage Letter Page',
};

class ProofOfMinimumEssentialCoverageLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE_LETTER)
  }
}

export default new ProofOfMinimumEssentialCoverageLetterScreen()
