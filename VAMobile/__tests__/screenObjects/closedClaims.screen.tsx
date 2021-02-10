import AppScreen from './app.screen';

const SELECTORS = {
  CLAIMS_CLOSED_SCREEN: '~closed-claims-page',
  NO_CLAIMS_AND_APPEALS_SCREEN: '~Claims: No-claims-page',
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
