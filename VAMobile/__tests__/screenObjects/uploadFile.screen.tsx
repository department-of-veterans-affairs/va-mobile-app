import AppScreen from './app.screen'

const SELECTORS = {
  UPLOAD_FILE_SCREEN: '~File-upload: Upload-file-page',
  UPLOAD_FILE_UPLOAD: '~Upload',

  // picker
  UPLOAD_FILE_DOCUMENT_TYPE_PICKER: '~Document type picker required',
  UPLOAD_FILE_DOCUMENT_TYPE_PICKER_DONE_BUTTON: '~Done',
}

class UploadFileScreen extends AppScreen {
  constructor() {
    super(SELECTORS.UPLOAD_FILE_SCREEN)
  }

  get uploadButton() {
    return $(SELECTORS.UPLOAD_FILE_UPLOAD)
  }

  get documentTypePicker() {
    return $(SELECTORS.UPLOAD_FILE_DOCUMENT_TYPE_PICKER)
  }

  // use src/constants/documentTypes.ts labels
  selectDocumentType(documentType: string) {
    return $(`~${documentType}`)
  }

  get documentTypePickerDoneButton() {
    return $(SELECTORS.UPLOAD_FILE_DOCUMENT_TYPE_PICKER_DONE_BUTTON)
  }
}

export default new UploadFileScreen()
