import AppScreen from './app.screen';

const SELECTORS = {
  CLAIMS_DETAILS_INFO_SCREEN: '~Claim-details-info-screen',
};

class ClaimsDetailsInfoScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIMS_DETAILS_INFO_SCREEN)
  }
}

export default new ClaimsDetailsInfoScreen()
