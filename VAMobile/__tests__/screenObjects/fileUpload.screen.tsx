import AppScreen from './app.screen';

const SELECTORS = {
  FILE_UPLOAD_SCREEN: '~File-upload-page',
  FILE_UPLOAD_VIEW_DETAILS: '~View details'
};

class FileUploadScreen extends AppScreen {
  constructor() {
    super(SELECTORS.FILE_UPLOAD_SCREEN)
  }

  get viewDetailsButton() {
    return $(SELECTORS.FILE_UPLOAD_VIEW_DETAILS)
  }
}

export default new FileUploadScreen()
