import AppScreen from './app.screen';

const SELECTORS = {
  CLAIM_DETAILS_INFO_SCREEN: '~Your-claim: Details-tab-claim-details-page',
};

class ClaimDetailsInfoScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIM_DETAILS_INFO_SCREEN)
  }
}

export default new ClaimDetailsInfoScreen()
