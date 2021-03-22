import AppScreen from './app.screen';

const SELECTORS = {
  FILE_UPLOAD_SCREEN: '~File-upload-page',
  FILE_UPLOAD_VIEW_DETAILS: '~View details',
  FILE_UPLOAD_SELECT_A_FILE: '~Select a file',
}

class FileUploadScreen extends AppScreen {
  constructor() {
    super(SELECTORS.FILE_UPLOAD_SCREEN)
  }

  get viewDetailsButton() {
    return $(SELECTORS.FILE_UPLOAD_VIEW_DETAILS)
  }

  get selectFileButton() {
    return $(SELECTORS.FILE_UPLOAD_SELECT_A_FILE)
  }
}

export default new FileUploadScreen()
