import AppScreen from './app.screen'

const SELECTORS = {
  CLAIMS_DETAILS_STATUS_SCREEN: '~Your-claim: Status-tab-claim-details-page',
  CLAIMS_DETAILS_STATUS_FIND_OUT_BUTTON: '~find-out-why-we-sometimes-combine-claims.',
  CLAIMS_DETAILS_STATUS_WHAT_SHOULD_I_DO_BUTTON: '~What should I do if I disagree with your decision on my V-A disability claim?',
  CLAIMS_DETAILS_STATUS_VIEW_FILE_REQUESTS: '~View File Requests',
}

class ClaimsDetailsStatusScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CLAIMS_DETAILS_STATUS_SCREEN)
  }

  get findOutButton() {
    return $(SELECTORS.CLAIMS_DETAILS_STATUS_FIND_OUT_BUTTON)
  }

  get whatShouldIDoButton() {
    return $(SELECTORS.CLAIMS_DETAILS_STATUS_WHAT_SHOULD_I_DO_BUTTON)
  }

  get viewFileRequestsButton() {
    return $(SELECTORS.CLAIMS_DETAILS_STATUS_VIEW_FILE_REQUESTS)
  }
}

export default new ClaimsDetailsStatusScreen()
