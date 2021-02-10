import AppScreen from './app.screen'

const SELECTORS = {
  SERVICE_VERIFICATION_LETTER: '~Letters: service-verification-letter-page',
};

class ServiceVerificationLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.SERVICE_VERIFICATION_LETTER)
  }
}

export default new ServiceVerificationLetterScreen()
