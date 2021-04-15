import AppScreen from './app.screen';

const SELECTORS = {
  ATTACHMENTS_SCREEN: '~Attachments-page',
}

class MessageAttachmentsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.ATTACHMENTS_SCREEN)
  }
}

export default new MessageAttachmentsScreen()
