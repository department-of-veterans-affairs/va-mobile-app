import AppScreen from './app.screen'

const SELECTORS = {
  PROOF_OF_SERVICE_LETTER: '~Proof of Service Card',
};

class ProofOfServiceLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PROOF_OF_SERVICE_LETTER)
  }
}

export default new ProofOfServiceLetterScreen()
