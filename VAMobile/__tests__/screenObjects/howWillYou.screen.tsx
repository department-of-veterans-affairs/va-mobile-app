import AppScreen from './app.screen'

const SELECTORS = {
  HOW_WILL_YOU_SCREEN: '~how-will-you-use-my-contact-information-page',
}

class HowWillYouScreen extends AppScreen {
  constructor() {
    super(SELECTORS.HOW_WILL_YOU_SCREEN)
  }
}

export default new HowWillYouScreen()
