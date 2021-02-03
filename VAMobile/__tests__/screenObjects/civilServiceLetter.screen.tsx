import AppScreen from './app.screen'

const SELECTORS = {
  CIVIL_SERVICE_LETTER: '~Civil Service Preference Letter',
};

class CivilServiceLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CIVIL_SERVICE_LETTER)
  }
}

export default new CivilServiceLetterScreen()
