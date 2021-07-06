import AppScreen from './app.screen'

const SELECTORS = {
  UPLOAD_CONFIRMATION_SCREEN: '~File-upload: Upload-confirmation-page',
  UPLOAD_CONFIRMATION_UPLOAD: '~Confirm upload',
}

class UploadConfirmationScreen extends AppScreen {
  constructor() {
    super(SELECTORS.UPLOAD_CONFIRMATION_SCREEN)
  }

  get confirmButton() {
    return $(SELECTORS.UPLOAD_CONFIRMATION_UPLOAD)
  }
}

export default new UploadConfirmationScreen()
