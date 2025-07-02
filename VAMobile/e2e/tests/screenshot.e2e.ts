import { by, device, element, expect, waitFor } from 'detox'
import { setTimeout } from 'timers/promises'

import { ClaimsE2eIdConstants } from './Claims.e2e'
// NOTE: bug found with letters download
// import { LettersConstants } from './VALetters.e2e'
import {
  CommonE2eIdConstants,
  loginToDemoMode,
  openAppointments,
  openBenefits,
  openClaims,
  openClaimsHistory,
  openHealth,
  openLetters,
  openMessages,
  openPayments,
  openPrescriptions,
  openProfile,
  openVAPaymentHistory,
} from './utils'

beforeAll(async () => {
  await loginToDemoMode()
})

describe('Screenshots', () => {
  describe('Screens', () => {
    it('should open home screen', async () => {
      await expect(element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT))).toExist()
      await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_TEXT)).tap()
      await device.takeScreenshot('HomeScreen')
    })
    it('should open health screen', async () => {
      await expect(element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT))).toExist()
      await element(by.text(CommonE2eIdConstants.HEALTH_TAB_BUTTON_TEXT)).tap()
      await device.takeScreenshot('HealthScreen')
    })
    it('should open benefits screen', async () => {
      await expect(element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT))).toExist()
      await element(by.text(CommonE2eIdConstants.BENEFITS_TAB_BUTTON_TEXT)).tap()
      await device.takeScreenshot('BenefitsScreen')
    })
    it('should open appointment details', async () => {
      await openHealth()
      await openAppointments()
      await waitFor(element(by.text('Vilanisi Reddy')))
        .toBeVisible()
        .whileElement(by.id(CommonE2eIdConstants.APPOINTMENTS_SCROLL_ID))
        .scroll(200, 'down')
      await element(by.text('Vilanisi Reddy')).tap()
      await device.takeScreenshot('AppointmentDetails')
    })
    it('should open messages inbox', async () => {
      await openHealth()
      await openMessages()
      await device.takeScreenshot('MessagesInbox')
    })
    // BUG: Possible buggy test
    // it('should open claim details', async () => {
    //   await openBenefits()
    //   await openClaims()
    //   await openClaimsHistory()
    //   await expect(element(by.text('Your active claims, decision reviews, and appeals'))).toExist()
    //   await expect(element(by.id(ClaimsE2eIdConstants.CLAIM_1_ID))).toExist()
    //   await element(by.id(ClaimsE2eIdConstants.CLAIM_1_ID)).tap()
    //   await device.takeScreenshot('claimDetails')
    // })
    it('should open profile screen', async () => {
      await element(by.text(CommonE2eIdConstants.HOME_TAB_BUTTON_ID)).tap()
      await openProfile()
      await device.takeScreenshot('ProfileScreen')
    })
    it('should open payments screen', async () => {
      await openPayments()
      await openVAPaymentHistory()
      await device.takeScreenshot('PaymentsHistory')
    })
    // BUG: Possible buggy test
    // it('should open prescriptions screen', async () => {
    //   await openHealth
    //   await openPrescriptions()
    //   await device.takeScreenshot('prescriptionsScreen')
    // })
  })
})

// BUG: Active issue debugging this problem
// for (const letterType of LettersConstants.LETTER_TYPES) {
//   it.skip(`should view ${letterType.name}`, async () => {
//     await element(by.text(letterType.name)).tap();
//     await expect(element(by.text(letterType.name))).toExist();
//     await expect(element(by.text(letterType.description))).toExist();
//     if (device.getPlatform() === "ios") {
//       const isBenefitSummaryLetter = await checkIfElementIsPresent(
//         LettersConstants.LETTER_BENEFIT_SUMMARY_ROW_ID,
//       );
//       if (isBenefitSummaryLetter) {
//         await element(
//           by.id(LettersConstants.LETTER_BENEFIT_SUMMARY_ROW_ID),
//         ).scrollTo("bottom");
//         await element(
//           by.id(LettersConstants.LETTER_BENEFIT_SUMMARY_ASK_VA_LINK_ID),
//         ).tap();
//         await element(
//           by.text(CommonE2eIdConstants.LEAVING_APP_LEAVE_TEXT),
//         ).tap();
//         await setTimeout(2000);
//         await device.takeScreenshot("benefitSummaryLetterAskVAWebpage");
//         await device.launchApp({ newInstance: false });
//       }
//       await element(
//         by.id(LettersConstants.LETTER_BENEFIT_SUMMARY_VIEW_LETTER_ID),
//       ).tap();
//       await expect(
//         element(by.text(LettersConstants.LETTER_FILE_NAME)),
//       ).toExist();
//       await element(by.text("Done")).tap();
//     }
//     await element(
//       by.id(LettersConstants.LETTER_BENEFIT_SUMMARY_BACK_ID),
//     ).tap();
//   });
// }
//   it('should open letter for download', async () => {
//     await element(by.text('Review letters')).tap()
//     await element(by.text('Service verification letter')).tap()
//     await element(by.text('Review letter')).tap()
//     await setTimeout(5000)
//     await device.takeScreenshot('DownloadLetter')
//   })
// })
//   })
// })
