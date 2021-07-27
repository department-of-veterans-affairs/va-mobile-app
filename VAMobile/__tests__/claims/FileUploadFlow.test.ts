import {androidScrollToElementWithText, delay, goBackToPreviousScreen, tabTo, waitForIsShown} from '../utils'
import ClaimsScreen from '../screenObjects/claims.screen'
import ClaimsActiveScreen from '../screenObjects/activeClaims.screen'
import ClaimsDetailsScreen from '../screenObjects/claimDetail.screen'
import ClaimsDetailsStatusScreen from '../screenObjects/claimDetailStatus.screen'
import FileUploadScreen from '../screenObjects/fileUpload.screen'
import UploadFileScreen from '../screenObjects/uploadFile.screen'
import SelectFileScreen from '../screenObjects/selectFile.screen'
import UploadConfirmationScreen from '../screenObjects/uploadConfirmation.screen'
import UploadSuccessScreen from '../screenObjects/uploadSuccess.screen'
import HealthScreen from '../screenObjects/health.screen'
import AskForClaimDecisionScreen from '../screenObjects/askForClaimDecision.screen'

export default () => {
  before(async () => {
    // await delay(30000)
    await tabTo('Claims')
    await ClaimsScreen.waitForIsShown()
  })

  describe('Active Claims File Upload', () => {
      describe('on click of a claim', () => {
        before(async () => {
          await ClaimsActiveScreen.waitForIsShown()
          const claimGivenID = await ClaimsActiveScreen.getClaimOrAppealGivenA11yLabel('~Claim for disability updated on November 30, 2020 Submitted November 13, 2020')

          await claimGivenID.click()
        })

        after(async () => {
          await goBackToPreviousScreen()
          await ClaimsDetailsStatusScreen.waitForIsShown()

          await goBackToPreviousScreen()
          await ClaimsActiveScreen.waitForIsShown()

          /**
           * TODO: remove this when we don't need it.
           * The user with open claims gets a 500 response when loading the profile which makes the logout button
           * inaccessible. To get around that, switch to a different tab and back to profile to clear the error
           */
          await tabTo('Profile')
          await delay(2000)
          await tabTo('Health')
          await HealthScreen.waitForIsShown()
        })

        describe('on claims details', () => {
          before(async () => {
            await ClaimsDetailsScreen.waitForIsShown()
          })

          describe('on click of the view file requests button', () => {
            before(async () => {
              await ClaimsDetailsStatusScreen.waitForIsShown()

              if (driver.isAndroid) {
                await androidScrollToElementWithText('View File Requests')
              }

              const viewFileRequestsButton = await ClaimsDetailsStatusScreen.viewFileRequestsButton
              await viewFileRequestsButton.click()
            })

            it('should render the file upload screen', async () => {
              await FileUploadScreen.waitForIsShown()
            })

            describe('on click of the view details button', () => {
              before(async () => {
                await FileUploadScreen.waitForIsShown()

                if (driver.isAndroid) {
                  await androidScrollToElementWithText('View details')
                }

                const viewDetailsButton = await FileUploadScreen.viewDetailsButton
                await viewDetailsButton.click()
              })

              after(async () => {
                await goBackToPreviousScreen()
                await FileUploadScreen.waitForIsShown()
              })

              it('should render the ask for your claim decision screen', async () => {
                await AskForClaimDecisionScreen.waitForIsShown()
              })
            })

            describe('on click of select a file', () => {
              before(async () => {
                await FileUploadScreen.waitForIsShown()

                if (driver.isAndroid) {
                  await androidScrollToElementWithText('Select a file')
                }

                const selectAFileButton = await FileUploadScreen.selectFileButton
                await selectAFileButton.click()
              })

              it('should go to the file upload screen when clicking select a file', async () => {
                await SelectFileScreen.waitForIsShown()
              })

              describe('on click of select a file', () => {
                before(async () => {
                  await SelectFileScreen.waitForIsShown()
                  const selectFileButton = await SelectFileScreen.selectFileButton
                  await selectFileButton.click()
                })

                it('should show the upload screen', async () => {
                  await UploadFileScreen.waitForIsShown()
                })

                describe('on click of upload', async () => {
                  before(async () => {
                    await UploadFileScreen.waitForIsShown()

                    // select picker
                    const documentTypePicker = await UploadFileScreen.documentTypePicker
                    await documentTypePicker.click()

                    // pick option(document type)
                    // use src/constants/documentTypes.ts labels
                    const selectDocumentType = await UploadFileScreen.selectDocumentType('Buddy/Lay Statement')
                    await selectDocumentType.click()

                    // select done
                    const documentTypePickerDoneButton = await UploadFileScreen.documentTypePickerDoneButton
                    await documentTypePickerDoneButton.click()

                    const uploadSelectAFileButton = await UploadFileScreen.uploadButton
                    await uploadSelectAFileButton.click()
                  })

                  it('should show the upload confirmation screen', async () => {
                    await UploadConfirmationScreen.waitForIsShown()
                  })

                  describe('on click of confirm upload', async () => {
                    before(async () => {
                      await UploadConfirmationScreen.waitForIsShown()
                      const uploadConfirmButton = await UploadConfirmationScreen.confirmButton
                      await uploadConfirmButton.click()
                    })

                    it('should show the upload success screen', async () => {
                      await UploadSuccessScreen.waitForIsShown()
                      const doneButton = await UploadSuccessScreen.doneButton
                      await doneButton.click()
                    })
                  })
                })
              })
            })
          })
        })

      })
    })
}
