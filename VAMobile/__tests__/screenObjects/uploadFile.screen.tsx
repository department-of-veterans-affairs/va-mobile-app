import AppScreen from './app.screen'

const SELECTORS = {
  UPLOAD_FILE_SCREEN: '~File-upload: Upload-file-page',
  UPLOAD_FILE_UPLOAD: '~Upload',
}

class UploadFileScreen extends AppScreen {
  constructor() {
    super(SELECTORS.UPLOAD_FILE_SCREEN)
  }

  get uploadButton() {
    return $(SELECTORS.UPLOAD_FILE_UPLOAD)
  }
}

export default new UploadFileScreen()
