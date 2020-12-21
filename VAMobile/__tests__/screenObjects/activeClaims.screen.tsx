import AppScreen from './app.screen';

const SELECTORS = {
  CLAIMS_ACTIVE_SCREEN: '~Claims-and-appeals-list-view-ACTIVE',
};

class ClaimsActiveScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIMS_ACTIVE_SCREEN)
  }

  getClaimOrAppealGivenA11yLabel(id: string) {
    return $(id)
  }
}

export default new ClaimsActiveScreen()
