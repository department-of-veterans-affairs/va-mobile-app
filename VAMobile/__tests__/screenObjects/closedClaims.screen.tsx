import AppScreen from './app.screen';

const SELECTORS = {
  CLAIMS_CLOSED_SCREEN: '~Claims-and-appeals-list-view-CLOSED',
  NO_CLAIMS_AND_APPEALS_SCREEN: '~No-claims-and-appeals-screen',
};

class ClaimsClosedScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIMS_CLOSED_SCREEN)
  }

  get NoClaimsAndAppeals() {
    return $(SELECTORS.NO_CLAIMS_AND_APPEALS_SCREEN)
  }
}

export default new ClaimsClosedScreen()
