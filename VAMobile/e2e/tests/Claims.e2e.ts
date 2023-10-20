import { expect, device, by, element, waitFor } from 'detox'
import { loginToDemoMode, openBenefits, openClaims, openClaimsHistory } from './utils'
import { setTimeout } from "timers/promises"

export const ClaimsE2eIdConstants = {
  CLAIM_1_ID: 'Claim for compensation updated on July 20, 2021 Submitted July 20, 2021',
  CLAIM_2_ID: 'Claim for compensation updated on May 05, 2021 Submitted January 01, 2021',
  CLAIM_3_ID: 'Claim for dependency updated on July 30, 2016 Submitted January 01, 2016',
  APPEAL_1_ID: 'Disability compensation appeal updated on November 22, 2011 Submitted June 12, 2008',
  CLOSED_CLAIM_DECISION_LETTER_ID: 'Claim for compensation updated on April 09, 2021 Submitted January 01, 2021 Decision letter available',
  CLAIM_1_STATUS_STEP_1_ID: 'Step 1 of 5. completed. Claim received July 20, 2021',
  CLAIM_1_STATUS_STEP_2_ID: 'Step 2 of 5. current. Initial review July 20, 2021',
  CLAIM_1_STATUS_STEP_3_ID: 'Step 3 of 5.  Evidence gathering, review, and decision',
  CLAIM_1_STATUS_STEP_4_ID: 'Step 4 of 5.  Preparation for notification',
  CLAIM_1_STATUS_STEP_5_ID: 'Step 5 of 5.  Complete',
  GET_CLAIMS_LETTER_BUTTON_ID: 'getClaimLettersTestID',
  DECISION_CLAIM_LETTER_1_ID: 'September 21, 2022 letter Decision Rating Letter',
  DECISION_CLAIM_LETTER_2_ID: 'September 21, 2022 letter Decision Rating Letter',
  FILE_REQUEST_BUTTON_ID: 'Review file requests',
  TAKE_OR_SELECT_PHOTOS_CAMERA_OPTION_TEXT: device.getPlatform() === 'ios' ? 'Camera' : 'Camera ',
  TAKE_OR_SELECT_PHOTOS_PHOTO_GALLERY_OPTION_TEXT: device.getPlatform() === 'ios' ? 'Photo Gallery' : 'Photo gallery ',
  SELECT_A_FILE_FILE_FOLDER_OPTION_TEXT: device.getPlatform() === 'ios' ? 'File Folder' : 'File folder ',
  SELECT_A_FILE_TEXT: 'Select a file',
  TAKE_OR_SELECT_PHOTOS_TEXT: 'Take or select photos',
  ACCEPTED_FILE_TYPES_TEXT: 'PDF (unlocked), GIF, JPEG, JPG, BMP, TXT',
  MAXIMUM_FILE_SIZE_LABEL: '50 megabytes',
  CLAIMS_DETAILS_SCREEN_ID: 'ClaimDetailsScreen',
  CLAIMS_HISTORY_TEXT: 'Claims history',
  CANCEL_TEXT: device.getPlatform() === 'ios' ? 'Cancel' : 'Cancel ',
}

beforeAll(async () => {
  await loginToDemoMode()
  await openBenefits()
  await openClaims()
  await openClaimsHistory()
})

describe('Claims Screen', () => { 
	it('should match the Claims history page design', async () => {
    await expect(element(by.text('Your active claims and appeals'))).toExist()
		await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_1_ID))).toExist()
		await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_2_ID))).toExist()
		await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_3_ID))).toExist()
		await expect(element(by.id(ClaimsE2eIdConstants.APPEAL_1_ID))).toExist()
	})

  it('should tap on a claim and verify the status detail page', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLAIM_1_ID)).tap()
    await expect(element(by.text('Status'))).toExist()
    await expect(element(by.text('Details'))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_1_STATUS_STEP_1_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_1_STATUS_STEP_2_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_1_STATUS_STEP_3_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_1_STATUS_STEP_4_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_1_STATUS_STEP_5_ID))).toExist()
  })

  it('should tap to open claim recieved and give the correct details', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLAIM_1_STATUS_STEP_1_ID)).atIndex(0).tap()
    await expect(element(by.text('Thank you. VA received your claim'))).toExist()
  })

  it('should tap to close claim recived and verify that no details are still displayed', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLAIM_1_STATUS_STEP_1_ID)).atIndex(0).tap()
    await expect(element(by.text('Thank you. VA received your claim'))).not.toExist()
  })

  it('should tap on why does the VA sometimes combine claims and give the correct information', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('bottom')
    await element(by.id('Why does  V-A  sometimes combine claims?')).tap()
    await expect(element(by.text('A note about consolidated claims'))).toExist()
    await element(by.text('Close')).tap()
  })

  it('should tap on what should I do if disagreement and give the correct information', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('bottom')
    await element(by.id(`What should I do if I disagree with  V-A 's decision on my disability claim?`)).tap()
    await expect(element(by.label('What should I do if I disagree with your decision on my  V-A  disability claim?'))).toExist()
    await element(by.id('ClaimsDecisionReviewOptionsTestID')).tap()
    await element(by.text('Ok')).tap()
    await setTimeout(5000)
    await device.takeScreenshot('DecisionReviewOptionsWebsite')
    await device.launchApp({newInstance: false})
    await element(by.text('Close')).tap()
  })

  it('should verify that the need help? section display the correct information', async () => {
    await expect(element(by.text('Need help?'))).toExist()
    await expect(element(by.text('Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.'))).toExist()
    await expect(element(by.id('ClaimsVANumberTestID'))).toExist()
    if (device.getPlatform() === 'android') {
			await element(by.id('ClaimsVANumberTestID')).tap()
			await setTimeout(5000)
			await device.takeScreenshot('ClaimsNeedHelpAndroidCallingScreen')
			await device.launchApp({newInstance: false})
		}
  })

  it('should navigate back to the claims history page', async () => {
    await element(by.text(ClaimsE2eIdConstants.CLAIMS_HISTORY_TEXT)).tap()
  })

  it('should tap on claim 2 and verify the dates match', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLAIM_2_ID)).tap()
    await expect(element(by.text('Received January 01, 2021'))).toExist()
  })
  
  it('should verify that the review file request button is visible in step 3(evidence gathering, review, and decision)', async () => {
		await waitFor(element(by.text('Review file requests'))).toBeVisible().whileElement(by.id(ClaimsE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scroll(100, 'down')
  })

  it('should tap to expand step 3 and verify that the review file request button is still visible', async () => {
    await element(by.id('Step 3 of 5. current. Evidence gathering, review, and decision June 4, 2021')).tap()
    await expect(element(by.id(ClaimsE2eIdConstants.FILE_REQUEST_BUTTON_ID))).toExist()
    await element(by.id('Step 3 of 5. current. Evidence gathering, review, and decision June 4, 2021')).tap()
  })

  it('should tap on review file requests and verify the number of requests matches the label in claim details', async () => {
    await element(by.id(ClaimsE2eIdConstants.FILE_REQUEST_BUTTON_ID)).tap()
    await expect(element(by.label('You have 3 file requests from  V-A '))).toExist()
  })

  it('should tap a file request and verify that the user is sent to the file upload page', async () => {
    await element(by.text('Request 2')).tap()
    await expect(element(by.text(ClaimsE2eIdConstants.SELECT_A_FILE_TEXT))).toExist()
    await expect(element(by.text(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT))).toExist()
  })

  it('should back out of the file request screen and reenter a new file request screen', async () => {
    await element(by.text('Requests')).tap()
    await element(by.text('Request 3')).tap()
  })

  it('should tap select a file and verify the select files screen displays the correct info', async () => {
    await element(by.text(ClaimsE2eIdConstants.SELECT_A_FILE_TEXT)).tap()
    await expect(element(by.text('Select a file to upload for Request 3'))).toExist()
    await expect(element(by.label(ClaimsE2eIdConstants.MAXIMUM_FILE_SIZE_LABEL))).toExist()
    await expect(element(by.text(ClaimsE2eIdConstants.ACCEPTED_FILE_TYPES_TEXT))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.SELECT_A_FILE_TEXT)).atIndex(1)).toExist()
  })

  it('should tap select a file and verify the options given', async () => {
    await element(by.id(ClaimsE2eIdConstants.SELECT_A_FILE_TEXT)).atIndex(1).tap()
    await expect(element(by.text(ClaimsE2eIdConstants.SELECT_A_FILE_FILE_FOLDER_OPTION_TEXT))).toExist()
    await expect(element(by.text(ClaimsE2eIdConstants.CANCEL_TEXT))).toExist()
  })

  it('should navigate back to the request <x> select a file screen', async () => {
    if(device.getPlatform() === 'android') {
      await element(by.text(ClaimsE2eIdConstants.CANCEL_TEXT)).tap()
    } else {
      await element(by.text(ClaimsE2eIdConstants.CANCEL_TEXT)).atIndex(1).tap()
    }
    await element(by.text('Cancel')).tap() 
  })

  it('should select take or select photos and verify the correct infomation is displayed', async () => {
    await element(by.text(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT)).tap()
    await expect(element(by.text('This feature is not yet accessible to screen readers'))).toExist()
    await expect(element(by.label(ClaimsE2eIdConstants.MAXIMUM_FILE_SIZE_LABEL))).toExist()
    await expect(element(by.text(ClaimsE2eIdConstants.ACCEPTED_FILE_TYPES_TEXT))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT)).atIndex(1)).toExist()
  })
  
  it('should select take or select photos and verify the options given', async () => {
    await element(by.id('takePhotosTestID')).scrollTo('bottom')
    if(device.getPlatform() === 'android') {
      await element(by.id(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT)).atIndex(0).tap()
    } else {
      await element(by.id(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_TEXT)).atIndex(1).tap()
    }
    await expect(element(by.text(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_CAMERA_OPTION_TEXT))).toExist()
    await expect(element(by.text(ClaimsE2eIdConstants.TAKE_OR_SELECT_PHOTOS_PHOTO_GALLERY_OPTION_TEXT))).toExist()
  })

  it('should navigate back to the file request screen', async () => {
    if(device.getPlatform() === 'android') {
      await element(by.text(ClaimsE2eIdConstants.CANCEL_TEXT)).tap()

    } else {
      await element(by.text(ClaimsE2eIdConstants.CANCEL_TEXT)).atIndex(1).tap()
    }
    await element(by.text('Cancel')).tap() 
    await element(by.text('Requests')).tap()
  })

  it('should tap on Review evaluation details and verify the correct information is displayed', async () => {
    await element(by.id('fileRequestPageTestID')).scrollTo('bottom')
    await element(by.id('Review evaluation details')).tap()
    await expect(element(by.text('Claim evaluation'))).toExist()
    await expect(element(by.text('I have submitted all evidence that will support my claim and I’m not going to turn in any more information. I would like VA to make a decision on my claim based on the information already provided. (Required)'))).toExist()
    await expect(element(by.id('Request claim evaluation'))).toExist()
  })

  it('should tap on request claim evaluation without checking the checkbox and have an error message appear', async () => {
    await element(by.id('askForClaimDecisionPageTestID')).scrollTo('bottom')
    await element(by.id('Request claim evaluation')).tap()
    await expect(element(by.text('Check the box to confirm the information is correct.'))).toExist()
  })

  it('should navigate back to the claims history screen', async () => {
    await element(by.text('Cancel')).tap()
    await element(by.text('Claim')).tap()
    await element(by.text(ClaimsE2eIdConstants.CLAIMS_HISTORY_TEXT)).tap() 
  })

  it('should tap on the closed tab', async () => {
    await element(by.text('Closed')).tap()
  })

  it('should tap on a closed claim with a decision letter and verify the status details page', async () => {
    await element(by.id(ClaimsE2eIdConstants.CLOSED_CLAIM_DECISION_LETTER_ID)).tap()
    await expect(element(by.text('We decided your claim on April 09, 2021'))).toExist()
    await expect(element(by.text('You can download your decision letter in the app. We also mailed you this letter.'))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.GET_CLAIMS_LETTER_BUTTON_ID))).toExist()
  })

  it('should verify that the need help? section display the correct information for closed claims', async () => {
    await expect(element(by.text('Need help?'))).toExist()
    await expect(element(by.text('Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.'))).toExist()
    await expect(element(by.id('ClaimsVANumberTestID'))).toExist()
    if (device.getPlatform() === 'android') {
      await element(by.id(ClaimsE2eIdConstants.CLAIMS_DETAILS_SCREEN_ID)).scrollTo('bottom')
			await element(by.id('ClaimsVANumberTestID')).tap()
			await setTimeout(5000)
			await device.takeScreenshot('AndroidCallingScreen')
			await device.launchApp({newInstance: false})
	  }
  })

  it('should tap on get claims letters and verify that the claims letters sceen is displayed', async () => {
    await element(by.id(ClaimsE2eIdConstants.GET_CLAIMS_LETTER_BUTTON_ID)).tap()
    await expect(element(by.text('Claim letters'))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.DECISION_CLAIM_LETTER_1_ID))).toExist()
    await expect(element(by.id(ClaimsE2eIdConstants.DECISION_CLAIM_LETTER_2_ID))).toExist()
  })
  
  it('should go back to the claims details page', async () => {
    await element(by.text('Claim details')).tap()
  })

  it('should open the details tab and verify the correct infomation is displayed', async () => {
    await element(by.text('Details')).tap()
    await expect(element(by.text('Claim type'))).toExist()
    await expect(element(by.text('Compensation'))).toExist()
    await expect(element(by.text('What you\'ve claimed'))).toExist()
    await expect(element(by.text('Date received'))).toExist()
    await expect(element(by.text('January 01, 2021')).atIndex(0)).toExist()
    await expect(element(by.text('Your representative for VA claims'))).toExist()
  })

  it('should navigate back to the claims landing page screen and tap on claims letters', async () => {
    await element(by.text(ClaimsE2eIdConstants.CLAIMS_HISTORY_TEXT)).tap() 
    await element(by.text('Claims')).tap()
    await element(by.text('Claim letters')).tap()
  })

  it('should tap on a claim letter and verify a pdf is displayed', async () => {
    if(device.getPlatform() === 'ios') {
      await element(by.id(ClaimsE2eIdConstants.DECISION_CLAIM_LETTER_1_ID)).tap()
      await setTimeout(5000)
      await device.takeScreenshot('DecisionLetter')
    }
  })
})