import AppScreen from './app.screen';

const SELECTORS = {
  WHAT_DO_I_DO_IF_DISAGREEMENT_SCREEN: '~what-should-i-do-if-i-disagree-with-va\'s-decision-on-my-disability-claim-page',
};

class WhatDoIDoIfDisagreementScreen extends AppScreen {
  constructor() {
    super(SELECTORS.WHAT_DO_I_DO_IF_DISAGREEMENT_SCREEN)
  }
}

export default new WhatDoIDoIfDisagreementScreen()
