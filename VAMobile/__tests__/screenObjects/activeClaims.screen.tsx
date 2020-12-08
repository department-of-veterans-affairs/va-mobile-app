import AppScreen from './app.screen';

const SELECTORS = {
  CLAIMS_ACTIVE_SCREEN: '~Claims-and-appeals-list-view-ACTIVE',
};

class ClaimsActiveScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIMS_ACTIVE_SCREEN)
  }
}

export default new ClaimsActiveScreen();
