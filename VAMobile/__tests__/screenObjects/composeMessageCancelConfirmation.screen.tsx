import AppScreen from './app.screen';

const SELECTORS = {
  COMPOSE_MESSAGE_CANCEL_CONFIRMATION_SCREEN: '~Compose Message Cancel Confirmation: compose-message-cancel-confirmation-page',
  GO_TO_INBOX: '~Cancel and go to Inbox',
}

class ComposeMessageCancelConfirmationScreen extends AppScreen {
  constructor() {
    super(SELECTORS.COMPOSE_MESSAGE_CANCEL_CONFIRMATION_SCREEN)
  }

  get goToInboxButton() {
    return $(SELECTORS.GO_TO_INBOX)
  }
}

export default new ComposeMessageCancelConfirmationScreen()
