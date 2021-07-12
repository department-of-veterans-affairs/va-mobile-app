import {androidScrollToElementWithText, goBackToPreviousScreen, tabTo, waitForIsShown} from '../utils'
import BenefitSummaryServiceVerification from '../screenObjects/benefitSummaryServiceVerification'
import DebugScreen from '../screenObjects/debug.screen'
import DirectDepositScreen from '../screenObjects/direct_deposit.screen'
import EditMailingAddressScreen from '../screenObjects/editMailingAddress.screen'
import EditResidentialAddressScreen from '../screenObjects/editResidentialAddress.screen'
import EditDirectDepositScreen from '../screenObjects/editDirectDeposit.screen'
import EditEmailScreen from '../screenObjects/editEmail.screen'
import EditHomePhoneNumberScreen from '../screenObjects/editHomePhoneNumber.screen'
import HowDoIUpdateScreen from '../screenObjects/howDoIUpdate.screen'
import HowWillYouScreen from '../screenObjects/howWillYou.screen'
import LettersListScreen from '../screenObjects/lettersList.screen'
import IncorrectServiceInfoScreen from '../screenObjects/incorrectServiceInfo.screen'
import LettersOverviewScreen from '../screenObjects/lettersOverview.screen'
import MilitaryInformationScreen from '../screenObjects/militaryInformation.screen'
import PersonalInformationScreen from '../screenObjects/personalInformation.screen'
import ProfileScreen from '../screenObjects/profile.screen'
import ServiceVerificationLetter from '../screenObjects/serviceVerificationLetter.screen'
import SettingsScreen from '../screenObjects/settings.screen'
import ManageYourAccountScreen from '../screenObjects/manageYourAccount.screen'
import CommissaryLetterScreen from '../screenObjects/commissaryLetter.screen'
import CivilServiceLetterScreen from '../screenObjects/civilServiceLetter.screen'
import BenefitVerificationLetterScreen from '../screenObjects/benefitVerificationLetter.screen'
import ProofOfServiceLetterScreen from '../screenObjects/proofOfServiceLetter.screen'
import ProofOfCreditablePrescriptionLetterScreen from '../screenObjects/proofOfCreditablePrescriptionLetter.screen'
import ProofOfMinimumEssentialCoverageLetterScreen from '../screenObjects/proofOfMinimumEssentialCoverageLetter.screen'

export default () => {
  before(async () => {
    tabTo('Profile')
    await ProfileScreen.waitForIsShown()
  })

  it('should render the profile page', async () => {
    let profilePersonalInfoButton = await ProfileScreen.profilePersonalInfoButton
    await expect(profilePersonalInfoButton.isExisting()).resolves.toEqual(true)

    let profileMilitaryInfoButton = await ProfileScreen.profileMilitaryInfoButton
    await expect(profileMilitaryInfoButton.isExisting()).resolves.toEqual(true)

    let profileDirectDepositButton = await ProfileScreen.profileDirectDepositButton
    await expect(profileDirectDepositButton.isExisting()).resolves.toEqual(true)

    let profileLettersAndDocsButton = await ProfileScreen.profileLettersAndDocsButton
    await expect(profileLettersAndDocsButton.isExisting()).resolves.toEqual(true)

    let profileSettingsButton = await ProfileScreen.profileSettingsButton
    await expect(profileSettingsButton.isExisting()).resolves.toEqual(true)
  })

  // TODO user does not have profile permissions, , move to a different user with profile permissions
  describe('Personal and contact information', () => {
    before(async () => {
      // Go to personal information screen
      let profilePersonalInfoButton = await ProfileScreen.profilePersonalInfoButton
      await profilePersonalInfoButton.click()
      await PersonalInformationScreen.waitForIsShown()
    })

    after(async () => {
      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()
    })

    it('should go to the personal information screen and render its content', async () => {
      let personalInformationHeader = await PersonalInformationScreen.personalInformationHeader
      await expect(personalInformationHeader.isExisting()).resolves.toEqual(true)

      let personalInformationAddressesHeader = await PersonalInformationScreen.personalInformationAddressesHeader
      await expect(personalInformationAddressesHeader.isExisting()).resolves.toEqual(true)

      if (driver.isAndroid) {
        await androidScrollToElementWithText('Phone numbers')
      }

      let personalInformationPhoneNumbersHeader = await PersonalInformationScreen.personalInformationPhoneNumbersHeader
      await expect(personalInformationPhoneNumbersHeader.isExisting()).resolves.toEqual(true)

      if (driver.isAndroid) {
        await androidScrollToElementWithText('Contact email address')
      }

      let personalInformationContactEmailHeader = await PersonalInformationScreen.personalInformationContactEmailHeader
      await expect(personalInformationContactEmailHeader.isExisting()).resolves.toEqual(true)
    })

    describe('How do i update my personal information', () => {
      after(async () => {
        // Go back to personal information screen
        await goBackToPreviousScreen()
        await PersonalInformationScreen.waitForIsShown()
      })

      it('should go to the how do i update screen from the personal information screen', async () => {
        if (driver.isAndroid) {
          await androidScrollToElementWithText('How do I update my personal information?')
        }

        // Go to how do I update screen
        let personalInformationHowDoIUpdateLink = await PersonalInformationScreen.personalInformationHowDoIUpdateLink
        await personalInformationHowDoIUpdateLink.click()
        await HowDoIUpdateScreen.waitForIsShown()

        let howDoIUpdateFindVALink = await HowDoIUpdateScreen.howDoIUpdateFindVALink
        await expect(howDoIUpdateFindVALink.isExisting()).resolves.toEqual(true)
      })
    })

    describe('on click of the mailing address', () => {
      after(async () => {
        // Go back to personal information screen
        const cancelButton = await EditEmailScreen.cancelButton
        await cancelButton.click()
        await PersonalInformationScreen.waitForIsShown()
      })

      it('should go to the edit address screen and render its content', async () => {
        if (driver.isAndroid) {
          await androidScrollToElementWithText('Mailing address')
        }

        // Go to edit address screen
        const personalInformationMailingAddressEdit = await PersonalInformationScreen.personalInformationMailingAddressEdit
        await personalInformationMailingAddressEdit.click()
        await EditMailingAddressScreen.waitForIsShown()
      })
    })

    describe('on click of the residential address', () => {
      after(async () => {
        // Go back to personal information screen
        const cancelButton = await EditEmailScreen.cancelButton
        await cancelButton.click()
        await PersonalInformationScreen.waitForIsShown()
      })

      it('should go to the edit address screen and render its content', async () => {
        if (driver.isAndroid) {
          await androidScrollToElementWithText('Home address')
        }

        // Go to edit address screen
        const personalInformationResidentialAddressEdit = await PersonalInformationScreen.personalInformationResidentialAddressEdit
        await personalInformationResidentialAddressEdit.click()
        await EditResidentialAddressScreen.waitForIsShown()
      })
    })

    // TODO phone number changes too often uncomment when stable
    xdescribe('on click of the home number', () => {
      after(async () => {
        // Go back to personal information screen
        const cancelButton = await EditHomePhoneNumberScreen.cancelButton
        await cancelButton.click()
        await PersonalInformationScreen.waitForIsShown()
      })

      it('should go to the edit phone number screen and render its content', async () => {
        if (driver.isAndroid) {
          await androidScrollToElementWithText('Phone numbers')
        }

        // Go to edit phone number screen for home
        const personalInformationHomeNumber = await PersonalInformationScreen.personalInformationHomeNumber('415-473-4382')
        await personalInformationHomeNumber.click()
        await EditHomePhoneNumberScreen.waitForIsShown()
      })
    })

    describe('How will you use my contact information', () => {
      after(async () => {
        // Go back to personal information screen
        await goBackToPreviousScreen()
        await PersonalInformationScreen.waitForIsShown()
      })

      it('should go to the how will you screen from the personal information screen', async () => {
        if (driver.isAndroid) {
          await androidScrollToElementWithText('How will VA use my contact information?')
        }

        // Go to how will you screen
        const personalInformationHowWillYouLink = await PersonalInformationScreen.personalInformationHowWillYouLink
        await personalInformationHowWillYouLink.click()
        await HowWillYouScreen.waitForIsShown()
      })
    })

    // TODO email changes too often uncomment when stable
    xdescribe('on click of a email', () => {
      after(async () => {
        // Go back to personal information screen
        const cancelButton = await EditEmailScreen.cancelButton
        await cancelButton.click()
        await PersonalInformationScreen.waitForIsShown()
      })

      it('should go to the edit email screen and render its content', async () => {
        if (driver.isAndroid) {
          await androidScrollToElementWithText('Contact email address')
        }

        // Go to edit email screen
        const personalInformationEmail = await PersonalInformationScreen.personalInformationEmailEdit('test@test.com')
        await personalInformationEmail.click()
        await EditEmailScreen.waitForIsShown()

        // TODO: test save flow when service is integrated
      })
    })
  })

  describe('Military information', () => {
    before(async () => {
      // Go to the military information screen
      let profileMilitaryInfoButton = await ProfileScreen.profileMilitaryInfoButton
      await profileMilitaryInfoButton.click()
      await MilitaryInformationScreen.waitForIsShown()
    })

    after( async () => {
      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()
    })

    it('should go to the military information page on button click and render its content', async () => {
      let periodOfServiceHeader = await MilitaryInformationScreen.periodOfServiceHeader
      let periodOfServiceHeaderText = await periodOfServiceHeader.getText()
      expect(periodOfServiceHeaderText).toEqual('Period of service')

      let incorrectServiceInfoLink = await MilitaryInformationScreen.incorrectServiceInfoLink
      await expect(incorrectServiceInfoLink.isExisting()).resolves.toEqual(true)
    })

    describe('What if my military service info does not look right', () => {
      after(async () => {
        // Go back to military screen
        await goBackToPreviousScreen()
        await MilitaryInformationScreen.waitForIsShown()
      })

      it('should go to the incorrect service info screen from military information screen', async () => {
        let incorrectServiceInfoLink = await MilitaryInformationScreen.incorrectServiceInfoLink
        await expect(incorrectServiceInfoLink.isExisting()).resolves.toEqual(true)

        await incorrectServiceInfoLink.click()
        await IncorrectServiceInfoScreen.waitForIsShown()

        if (driver.isAndroid) {
          await androidScrollToElementWithText('800-538-9552')
        }

        let DMDCNumber = await IncorrectServiceInfoScreen.DMDCNumber
        await expect(DMDCNumber.isExisting()).resolves.toEqual(true)
      })
    })
  })

  describe('Direct Deposit', () => {
    before(async () => {
      // Go to the direct deposit screen
      const profileDirectDepositButton = await ProfileScreen.profileDirectDepositButton
      await profileDirectDepositButton.click()
      await DirectDepositScreen.waitForIsShown()
    })

    after(async () => {
      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()
    })

    describe('on click of bank account', () => {
      after(async () => {
        // Go back to direct deposit screen
        const cancelButton = await EditDirectDepositScreen.cancelButton
        await cancelButton.click()
        await DirectDepositScreen.waitForIsShown()
      })

      it('should go to the edit direct deposit screen and render its content', async () => {
        // Go to edit direct deposit screen
        const directDepositBankEdit = await DirectDepositScreen.directDepositBankEdit()
        await directDepositBankEdit.click()
        await EditDirectDepositScreen.waitForIsShown()
      })
    })
  })

  describe('VA letters and documents', () => {
    before(async () => {
      // Go to letters overview screen
      const lettersButton = await ProfileScreen.profileLettersAndDocsButton
      await lettersButton.click()
      await LettersOverviewScreen.waitForIsShown()
    })

    after(async () => {
      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()
    })

    describe('on view letters button click', () => {
      before(async () => {
        // Go to letters list screen
        const lettersOverviewViewLettersButton = await LettersOverviewScreen.lettersOverviewViewLettersButton
        await lettersOverviewViewLettersButton.click()
      })

      after(async () => {
        // Go back to letters overview screen
        await goBackToPreviousScreen()
        await LettersOverviewScreen.waitForIsShown()
      })

      xit('should go to no letters screen', async () => {
        await waitForIsShown(LettersListScreen.noLetters)
      })

      it('should go to the letters list screen', async () => {
        await LettersListScreen.waitForIsShown()
      })

      describe('on benefit summary and service verification click', () => {
        before(async () => {
          await LettersListScreen.waitForIsShown()
        })

        after(async () => {
          // Go back to letters list screen
          await goBackToPreviousScreen()
          await LettersListScreen.waitForIsShown()
        })

        it('should go to the Benefit Summary and Service Verification screen', async () => {
          const benefitSummaryAndServiceVerification = await LettersListScreen.benefitSummaryAndServiceVerification
          await benefitSummaryAndServiceVerification.click()
          await BenefitSummaryServiceVerification.waitForIsShown()
        })
      })

      describe('on service verification click', () => {
        before(async () => {
          await LettersListScreen.waitForIsShown()
        })

        after(async () => {
          // Go back to letters list screen
          await goBackToPreviousScreen()
          await LettersListScreen.waitForIsShown()
        })

        it('should go to the Benefit Summary and Service Verification screen', async () => {
          const serviceVerification = await LettersListScreen.serviceVerification
          await serviceVerification.click()
          await ServiceVerificationLetter.waitForIsShown()
        })
      })

      describe('on commissary letter click', () => {
        before(async () => {
          await LettersListScreen.waitForIsShown()
        })

        after(async () => {
          // Go back to letters list screen
          await goBackToPreviousScreen()
          await LettersListScreen.waitForIsShown()
        })

        it('should go to the Commissary Letter screen', async () => {
          const commissary = await LettersListScreen.commissary
          await commissary.click()
          await CommissaryLetterScreen.waitForIsShown()
        })
      })

      describe('on civil service letter click', () => {
        before(async () => {
          await LettersListScreen.waitForIsShown()
        })

        after(async () => {
          // Go back to letters list screen
          await goBackToPreviousScreen()
          await LettersListScreen.waitForIsShown()
        })

        it('should go to the Civil Service Letter screen', async () => {
          const civilService = await LettersListScreen.civilService
          await civilService.click()
          await CivilServiceLetterScreen.waitForIsShown()
        })
      })

      describe('on benefit verification letter click', () => {
        before(async () => {
          await LettersListScreen.waitForIsShown()
        })

        after(async () => {
          // Go back to letters list screen
          await goBackToPreviousScreen()
          await LettersListScreen.waitForIsShown()
        })

        it('should go to the Benefit Verification Letter screen', async () => {
          const benefitVerification = await LettersListScreen.benefitVerification
          await benefitVerification.click()
          await BenefitVerificationLetterScreen.waitForIsShown()
        })
      })

      describe('on proof of service letter click', () => {
        before(async () => {
          await LettersListScreen.waitForIsShown()
        })

        after(async () => {
          // Go back to letters list screen
          await goBackToPreviousScreen()
          await LettersListScreen.waitForIsShown()
        })

        it('should go to the Proof of Service Letter screen', async () => {
          const proofOfService = await LettersListScreen.proofOfService
          await proofOfService.click()
          await ProofOfServiceLetterScreen.waitForIsShown()
        })
      })

      xdescribe('on proof of creditable prescription drug coverage letter click', () => {
        before(async () => {
          await LettersListScreen.waitForIsShown()
        })

        after(async () => {
          // Go back to letters list screen
          await goBackToPreviousScreen()
          await LettersListScreen.waitForIsShown()
        })

        it('should go to the Proof of Creditable Prescription Drug Coverage Letter screen', async () => {
          const proofOfCreditablePrescription = await LettersListScreen.proofOfCreditablePrescription
          await proofOfCreditablePrescription.click()
          await ProofOfCreditablePrescriptionLetterScreen.waitForIsShown()
        })
      })

      xdescribe('on proof of minimum essential coverage letter click', () => {
        before(async () => {
          await LettersListScreen.waitForIsShown()
        })

        after(async () => {
          // Go back to letters list screen
          await goBackToPreviousScreen()
          await LettersListScreen.waitForIsShown()
        })

        it('should go to the Proof of Minimum Essential Coverage Letter screen', async () => {
          const proofOfMinCoverage = await LettersListScreen.proofOfMinCoverage
          await proofOfMinCoverage.click()
          await ProofOfMinimumEssentialCoverageLetterScreen.waitForIsShown()
        })
      })
    })

    describe('on mailing address click', () => {
      after(async () => {
        // Go back to overview
        const cancelButton = await EditEmailScreen.cancelButton
        await cancelButton.click()
      })

      it('should go to the edit address screen', async () => {
        // Go to edit address
        const addressButton = await LettersOverviewScreen.lettersMailingAddress
        await addressButton.click()
        await EditMailingAddressScreen.waitForIsShown()
      })
    })
  })

  describe('Settings', () => {
    before(async () => {
      // Go to the settings page
      let profileSettingsButton = await ProfileScreen.profileSettingsButton
      await profileSettingsButton.click()
      await SettingsScreen.waitForIsShown()
    })

    after(async () => {
      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()
    })

    it('should go to the settings page on button click and render its content', async () => {
      let manageAccountButton = await SettingsScreen.settingsManageAccountButton
      await expect(manageAccountButton.isExisting()).resolves.toEqual(true)

      // TODO bring back share - removed at the moment
      // let settingsShareAppButton = await SettingsScreen.settingsShareAppButton
      // await expect(settingsShareAppButton.isExisting()).resolves.toEqual(true)

      let settingsPrivacyPolicyButton = await SettingsScreen.settingsPrivacyPolicyButton
      await expect(settingsPrivacyPolicyButton.isExisting()).resolves.toEqual(true)
    })

    describe('Manage your account', () => {
      after(async () => {
        // Go back to settings screen
        await goBackToPreviousScreen()
        await SettingsScreen.waitForIsShown()
      })

      it('should go to the Manage your account screen on button click and render its screen', async () => {
        // Go to Manage your account
        let settingsManageAccountButton = await SettingsScreen.settingsManageAccountButton
        await settingsManageAccountButton.click()
        await ManageYourAccountScreen.waitForIsShown()
      })
    })

    describe('Developer Screen', () => {
      after(async () => {
        // Go back to settings screen
        await goBackToPreviousScreen()
        await SettingsScreen.waitForIsShown()
      })

      it('should go to the debug page on button click and render its screen', async () => {
        // Go to Debug
        let settingsDebugButton = await SettingsScreen.settingsDebugButton
        await settingsDebugButton.click()
        await DebugScreen.waitForIsShown()
      })
    })
  })
}
