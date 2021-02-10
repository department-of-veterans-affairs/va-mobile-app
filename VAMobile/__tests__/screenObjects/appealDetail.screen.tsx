import AppScreen from './app.screen';

const SELECTORS = {
  APPEAL_DETAILS_SCREEN: '~Your-appeal: Appeal-details-page',
  APPEAL_DETAILS_STATUS_TAB: '~Status',
  APPEAL_DETAILS_DETAILS_TAB: '~Details'
};

class AppealDetailsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.APPEAL_DETAILS_SCREEN)
  }

  get statusTab() {
    return $(SELECTORS.APPEAL_DETAILS_STATUS_TAB)
  }

  get detailsTab() {
    return $(SELECTORS.APPEAL_DETAILS_DETAILS_TAB)
  }
}

export default new AppealDetailsScreen()
