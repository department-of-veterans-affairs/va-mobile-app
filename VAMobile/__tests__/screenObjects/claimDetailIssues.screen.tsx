import AppScreen from './app.screen';

const SELECTORS = {
  CLAIMS_DETAILS_ISSUES_SCREEN: '~Claim-issues-screen',
};

class ClaimsDetailsIssuesScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIMS_DETAILS_ISSUES_SCREEN)
  }
}

export default new ClaimsDetailsIssuesScreen()
