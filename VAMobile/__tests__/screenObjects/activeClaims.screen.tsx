import AppScreen from './app.screen';

const SELECTORS = {
  CLAIMS_ACTIVE_SCREEN: '~active-claims-page',
  NO_CLAIMS_AND_APPEALS_SCREEN: '~Claims: No-claims-page',
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
