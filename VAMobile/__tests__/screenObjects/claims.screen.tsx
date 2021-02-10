import AppScreen from './app.screen';

const SELECTORS = {
  CLAIMS_SCREEN: '~Claims-page',
  CLAIMS_ACTIVE_TAB: '~Active',
  CLAIMS_CLOSED_TAB: '~Closed'
};

class ClaimsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIMS_SCREEN)
  }

  get claimsActiveTab () {
    return $(SELECTORS.CLAIMS_ACTIVE_TAB)
  }

  get claimsClosedTab () {
    return $(SELECTORS.CLAIMS_CLOSED_TAB)
  }
}

export default new ClaimsScreen()
