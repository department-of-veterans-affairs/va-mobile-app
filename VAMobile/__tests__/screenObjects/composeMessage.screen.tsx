import AppScreen from './app.screen';

const SELECTORS = {
  COMPOSE_MESSAGE_SCREEN: '~Compose-message-page',
  COMPOSE_MESSAGE_ADD_FILES: '~Add files'
}

class ComposeMessageScreen extends AppScreen {
  constructor() {
    super(SELECTORS.COMPOSE_MESSAGE_SCREEN)
  }

  get composeMessageAddFiles() {
    return $(SELECTORS.COMPOSE_MESSAGE_ADD_FILES)
  }
}

export default new ComposeMessageScreen()
