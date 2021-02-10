import AppScreen from './app.screen';

const SELECTORS = {
  CLAIMS_DETAILS_SCREEN: '~Your-claim: Claim-details-page',
  CLAIMS_DETAILS_STATUS_TAB: '~Status',
  CLAIMS_DETAILS_DETAILS_TAB: '~Details'
};

class ClaimsDetailsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIMS_DETAILS_SCREEN)
  }

  get statusTab() {
    return $(SELECTORS.CLAIMS_DETAILS_STATUS_TAB)
  }

  get detailsTab() {
    return $(SELECTORS.CLAIMS_DETAILS_DETAILS_TAB)
  }
}

export default new ClaimsDetailsScreen()
