import AppScreen from './app.screen';

const SELECTORS = {
  CLAIMS_ACTIVE_SCREEN: '~Claims-and-appeals-list-view-ACTIVE',
  NO_CLAIMS_AND_APPEALS_SCREEN: '~No-claims-and-appeals-screen',
};

class ClaimsActiveScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIMS_ACTIVE_SCREEN)
  }

  get NoClaimsAndAppeals() {
    return $(SELECTORS.NO_CLAIMS_AND_APPEALS_SCREEN)
  }

  getClaimOrAppealGivenA11yLabel(id: string) {
    return $(id)
  }
}

export default new ClaimsActiveScreen()
