import AppScreen from './app.screen';

const SELECTORS = {
  ASK_FOR_CLAIM_DECISION_SCREEN: '~ask-for-your-claim-decision-page',
};

class AskForClaimDecisionScreen extends AppScreen {
  constructor() {
    super(SELECTORS.ASK_FOR_CLAIM_DECISION_SCREEN)
  }
}

export default new AskForClaimDecisionScreen()
