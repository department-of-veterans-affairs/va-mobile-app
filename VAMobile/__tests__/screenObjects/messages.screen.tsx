import AppScreen from './app.screen';

const SELECTORS = {
  MESSAGES_SCREEN: '~SecureMessaging-page',
  MESSAGES_INBOX_TAB: '~Inbox',
  MESSAGES_INBOX_NO_MESSAGES: '~Messages: No-messages-page',
  MESSAGE_INBOX: '~Inbox-page',
  MESSAGES_FOLDERS_TAB: '~Folders',
  MESSAGES_FOLDERS: '~Folders-page',
  MESSAGES_SENT_FOLDER: '~Sent',
  MESSAGES_COMPOSE_MESSAGE_BUTTON: '~Compose a Message',
};

class MessagesScreen extends AppScreen {
  constructor() {
    super(SELECTORS.MESSAGES_SCREEN)
  }

  get messagesInboxTab() {
    return $(SELECTORS.MESSAGES_INBOX_TAB)
  }

  get messagesNoMessages() {
    return $(SELECTORS.MESSAGES_INBOX_NO_MESSAGES)
  }

  get messagesInboxSection() {
    return $(SELECTORS.MESSAGE_INBOX)
  }

  messagesSingleMessage(id: string) {
    return $(id)
  }

  get messagesFoldersTab() {
    return $(SELECTORS.MESSAGES_FOLDERS_TAB)
  }

  get messagesFolderSection() {
    return $(SELECTORS.MESSAGES_FOLDERS)
  }

  get messagesSentFolder() {
    return $(SELECTORS.MESSAGES_SENT_FOLDER)
  }

  get messagesComposeAMessageButton() {
    return $(SELECTORS.MESSAGES_COMPOSE_MESSAGE_BUTTON)
  }
}

export default new MessagesScreen()
