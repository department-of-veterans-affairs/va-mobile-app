import AppScreen from './app.screen'

const SELECTORS = {
  VIEW_MESSAGE_SCREEN: '~ViewMessage-page',
}

class ViewMessageScreen extends AppScreen {
  constructor() {
    super(SELECTORS.VIEW_MESSAGE_SCREEN)
  }
}

export default new ViewMessageScreen()
