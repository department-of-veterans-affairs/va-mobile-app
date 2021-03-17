import AppScreen from './app.screen'

const SELECTORS = {
  UPLOAD_SUCCESS_SCREEN: '~File-Upload: Upload-success-page',
  UPLOAD_SUCCESS_UPLOAD: '~View all file requests',
}

class UploadSuccessScreen extends AppScreen {
  constructor() {
    super(SELECTORS.UPLOAD_SUCCESS_SCREEN)
  }

  get doneButton() {
    return $(SELECTORS.UPLOAD_SUCCESS_UPLOAD)
  }
}

export default new UploadSuccessScreen()
