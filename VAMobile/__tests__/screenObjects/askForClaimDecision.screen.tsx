import AppScreen from './app.screen';

const SELECTORS = {
  ASK_FOR_CLAIM_DECISION_SCREEN: '~Ask-for-claim-decision-screen',
};

class AskForClaimDecisionScreen extends AppScreen {
  constructor() {
    super(SELECTORS.ASK_FOR_CLAIM_DECISION_SCREEN)
  }
}

export default new AskForClaimDecisionScreen()
