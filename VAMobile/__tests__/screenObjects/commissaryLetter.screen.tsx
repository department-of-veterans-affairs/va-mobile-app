import AppScreen from './app.screen'

const SELECTORS = {
  COMMISSARY_LETTER: '~Letters: commissary-letter-page',
};

class CommissaryLetterScreen extends AppScreen {
  constructor() {
    super(SELECTORS.COMMISSARY_LETTER)
  }
}

export default new CommissaryLetterScreen()
