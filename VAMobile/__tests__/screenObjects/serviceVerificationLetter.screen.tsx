import AppScreen from './app.screen'

const SELECTORS = {
  SVL_SCREEN: '~Service-Verification-Letter-Screen',
};

class ServiceVerificationLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.SVL_SCREEN)
  }
}

export default new ServiceVerificationLetterScreen()
