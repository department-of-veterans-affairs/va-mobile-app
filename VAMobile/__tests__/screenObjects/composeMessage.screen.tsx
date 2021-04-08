import AppScreen from './app.screen';

const SELECTORS = {
  COMPOSE_MESSAGE_SCREEN: '~Compose-message-page'
}

class ComposeMessageScreen extends AppScreen {
  constructor() {
    super(SELECTORS.COMPOSE_MESSAGE_SCREEN)
  }
}

export default new ComposeMessageScreen()
