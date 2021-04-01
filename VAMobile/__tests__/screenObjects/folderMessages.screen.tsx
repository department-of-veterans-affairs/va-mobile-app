import AppScreen from './app.screen';

const SELECTORS = {
  FOLDER_MESSAGES_SCREEN: '~FolderMessages-page',
};

class FolderMessagesScreen extends AppScreen {
  constructor() {
    super(SELECTORS.FOLDER_MESSAGES_SCREEN)
  }

  folderMessagesSingleMessage(id: string) {
    return $(id)
  }
}

export default new FolderMessagesScreen()
