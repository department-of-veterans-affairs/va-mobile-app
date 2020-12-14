import AppScreen from './app.screen';

const SELECTORS = {
  CLAIM_DETAILS_INFO_SCREEN: '~Claim-details-info-screen',
};

class ClaimDetailsInfoScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIM_DETAILS_INFO_SCREEN)
  }
}

export default new ClaimDetailsInfoScreen()
