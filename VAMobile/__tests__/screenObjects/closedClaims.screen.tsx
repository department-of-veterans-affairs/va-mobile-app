import AppScreen from './app.screen';

const SELECTORS = {
  CLAIMS_CLOSED_SCREEN: '~Claims-and-appeals-list-view-CLOSED'
};

class ClaimsClosedScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIMS_CLOSED_SCREEN)
  }
}

export default new ClaimsClosedScreen()
