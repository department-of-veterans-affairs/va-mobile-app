import AppScreen from './app.screen'

const SELECTORS = {
  SELECT_FILE_SCREEN: '~File-upload: Select-a-file-to-upload-for-the-request-page',
  SELECT_FILE_SELECT_BUTTON: '~selectfilebutton2',
}

class SelectFileScreen extends AppScreen {
  constructor() {
    super(SELECTORS.SELECT_FILE_SCREEN)
  }

  get selectFileButton() {
    return $(SELECTORS.SELECT_FILE_SELECT_BUTTON)
  }
}

export default new SelectFileScreen()
