import AppScreen from './app.screen'

const SELECTORS = {
  INCORRECT_SERVICE_INFO_SCREEN: "~what-if-my-military-service-information-doesn't-look-right-page",
  INCORRECT_SERVICE_INFO_DMDC_NUMBER: '~800-538-9552',
}

class IncorrectServiceInfoScreen extends AppScreen {
  constructor() {
    super(SELECTORS.INCORRECT_SERVICE_INFO_SCREEN)
  }

  get DMDCNumber() {
    return $(SELECTORS.INCORRECT_SERVICE_INFO_DMDC_NUMBER)
  }

}

export default new IncorrectServiceInfoScreen()
