import AppScreen from './app.screen'

const SELECTORS = {
  PROOF_OF_SERVICE_LETTER: '~Letters: Proof of Service Card Page',
};

class ProofOfServiceLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PROOF_OF_SERVICE_LETTER)
  }
}

export default new ProofOfServiceLetterScreen()
