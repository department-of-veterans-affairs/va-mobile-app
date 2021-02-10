import AppScreen from './app.screen'

const SELECTORS = {
  BENEFIT_VERIFICATION_LETTER: '~Letters: benefit-verification-letter-page',
};

class BenefitVerificationLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.BENEFIT_VERIFICATION_LETTER)
  }
}

export default new BenefitVerificationLetterScreen()
