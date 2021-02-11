import AppScreen from './app.screen';

const SELECTORS = {
  MILITARY_INFORMATION_SCREEN: '~Military-Information-page',
  MILITARY_INFORMATION_PERIOD_OF_SERVICE_HEADER: '~period-of-service',
  MILITARY_INFORMATION_INCORRECT_SERVICE_INFO_LINK: `~what-if-my-military-service-information-doesn't-look-right?`,
}

class MilitaryInformationScreen extends AppScreen {
  constructor() {
    super(SELECTORS.MILITARY_INFORMATION_SCREEN)
  }

  get periodOfServiceHeader() {
    return $(SELECTORS.MILITARY_INFORMATION_PERIOD_OF_SERVICE_HEADER)
  }

  get incorrectServiceInfoLink() {
    return $(SELECTORS.MILITARY_INFORMATION_INCORRECT_SERVICE_INFO_LINK)
  }
}

export default new MilitaryInformationScreen()
