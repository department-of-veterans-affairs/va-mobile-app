import AppScreen from './app.screen'

const SELECTORS = {
  PROOF_OF_CREDITABLE_PRESCRIPTION_LETTER: '~Letters: proof-of-creditable-prescription-drug-coverage-letter-page',
};

class ProofOfCreditablePrescriptionLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PROOF_OF_CREDITABLE_PRESCRIPTION_LETTER)
  }
}

export default new ProofOfCreditablePrescriptionLetterScreen()
