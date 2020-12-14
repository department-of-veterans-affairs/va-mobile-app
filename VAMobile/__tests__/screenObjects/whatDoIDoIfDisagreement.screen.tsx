import AppScreen from './app.screen';

const SELECTORS = {
  WHAT_DO_I_DO_IF_DISAGREEMENT_SCREEN: '~What-do-I-do-if-disagreement-screen',
};

class WhatDoIDoIfDisagreementScreen extends AppScreen {
  constructor() {
    super(SELECTORS.WHAT_DO_I_DO_IF_DISAGREEMENT_SCREEN)
  }
}

export default new WhatDoIDoIfDisagreementScreen()
