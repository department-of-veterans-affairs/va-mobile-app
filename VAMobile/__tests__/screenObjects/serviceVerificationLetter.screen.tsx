import AppScreen from './app.screen'

const SELECTORS = {
  SERVICE_VERIFICATION_LETTER: '~Service-Verification-Letter-Screen',
};

class ServiceVerificationLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.SERVICE_VERIFICATION_LETTER)
  }
}

export default new ServiceVerificationLetterScreen()
