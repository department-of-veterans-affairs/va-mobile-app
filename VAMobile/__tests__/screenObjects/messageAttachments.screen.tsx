import AppScreen from './app.screen';

const SELECTORS = {
  ATTACHMENTS_SCREEN: '~Attachments-page',
  ATTACHMENTS_SELECT_FILE_BUTTON: '~Select a file',
  ATTACHMENTS_ATTACH_BUTTON: '~Attach',
  ATTACHMENTS_CANCEL_BUTTON: '~Cancel'
}

class MessageAttachmentsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.ATTACHMENTS_SCREEN)
  }

  get selectFileButton() {
    return $(SELECTORS.ATTACHMENTS_SELECT_FILE_BUTTON)
  }

  get attachButton() {
    return $(SELECTORS.ATTACHMENTS_ATTACH_BUTTON)
  }

  get cancelButton() {
    return $(SELECTORS.ATTACHMENTS_CANCEL_BUTTON)
  }
}

export default new MessageAttachmentsScreen()
