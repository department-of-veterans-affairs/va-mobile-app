import AppScreen from './app.screen'

const SELECTORS = {
  BSSV_SCREEN: '~Letters: Benefit-Summary-Service-Verification-Letter-Page',
};

class BenefitSummaryServiceVerification extends AppScreen {
  constructor() {
    super(SELECTORS.BSSV_SCREEN)
  }
}

export default new BenefitSummaryServiceVerification()
