import AppScreen from './app.screen'

const SELECTORS = {
  PROOF_OF_CREDITABLE_PRESCRIPTION_LETTER: '~Proof of Creditable Prescription Drug Coverage Letter',
};

class ProofOfCreditablePrescriptionLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PROOF_OF_CREDITABLE_PRESCRIPTION_LETTER)
  }
}

export default new ProofOfCreditablePrescriptionLetterScreen()
