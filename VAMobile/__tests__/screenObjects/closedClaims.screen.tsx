import AppScreen from './app.screen';

const SELECTORS = {
  CCLAIMS_CLOSED_SCREEN: '~Claims-and-appeals-list-view-CLOSED'
};

class ClaimsClosedScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CCLAIMS_CLOSED_SCREEN)
  }
}

export default new ClaimsClosedScreen();
