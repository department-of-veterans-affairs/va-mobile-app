import AppScreen from './app.screen';

const SELECTORS = {
  CLAIMS_DETAILS_SCREEN: '~Claims-details-screen',
  CLAIM_DETAILS_STATUS_TAB: '~Status'
};

class ClaimsDetailsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIMS_DETAILS_SCREEN)
  }

  get statusTab() {
    return $(SELECTORS.CLAIM_DETAILS_STATUS_TAB)
  }
}

export default new ClaimsDetailsScreen()
