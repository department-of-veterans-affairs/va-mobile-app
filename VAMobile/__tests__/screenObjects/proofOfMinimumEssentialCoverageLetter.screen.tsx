import AppScreen from './app.screen'

const SELECTORS = {
  PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE_LETTER: '~Proof of Minimum Essential Coverage Letter',
};

class ProofOfMinimumEssentialCoverageLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE_LETTER)
  }
}

export default new ProofOfMinimumEssentialCoverageLetterScreen()
