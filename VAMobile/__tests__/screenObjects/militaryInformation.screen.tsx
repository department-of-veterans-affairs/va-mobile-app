import AppScreen from './app.screen';

const SELECTORS = {
  MILITARY_INFORMATION_SCREEN: '~Military-Information-screen',
  MILITARY_INFORMATION_PERIOD_OF_SERVICE_HEADER: '~period-of-service',
  MILITARY_INFORMATION_WHAT_IF_LINK: `~what-if-my-military-service-information-doesn't-look-right?`,
}

class MilitaryInformationScreen extends AppScreen {
  constructor() {
    super(SELECTORS.MILITARY_INFORMATION_SCREEN)
  }

  get periodOfServiceHeader () {
    return $(SELECTORS.MILITARY_INFORMATION_PERIOD_OF_SERVICE_HEADER)
  }

  get whatIfLink () {
    return $(SELECTORS.MILITARY_INFORMATION_WHAT_IF_LINK)
  }
}

export default new MilitaryInformationScreen()
