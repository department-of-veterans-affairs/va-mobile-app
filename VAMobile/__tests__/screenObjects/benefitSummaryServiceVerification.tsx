import AppScreen from './app.screen'

const SELECTORS = {
  BSSV_SCREEN: '~Benefit-Summary-Service-Verification-Screen',
};

class BenefitSummaryServiceVerification extends AppScreen {
  constructor() {
    super(SELECTORS.BSSV_SCREEN)
  }
}

export default new BenefitSummaryServiceVerification()
