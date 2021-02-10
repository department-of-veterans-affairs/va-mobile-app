import AppScreen from './app.screen'

const SELECTORS = {
  PROOF_OF_SERVICE_LETTER: '~Letters: proof-of-service-card-page',
};

class ProofOfServiceLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PROOF_OF_SERVICE_LETTER)
  }
}

export default new ProofOfServiceLetterScreen()
