import AppScreen from './app.screen'

const SELECTORS = {
  CIVIL_SERVICE_LETTER: '~Letters: Civil Service Preference Letter Page',
};

class CivilServiceLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CIVIL_SERVICE_LETTER)
  }
}

export default new CivilServiceLetterScreen()
