import { androidScrollToElementWithText, delay, goBackToPreviousScreen, tabTo } from '../utils'
import DebugScreen from '../screenObjects/debug.screen'
import DirectDepositScreen from '../screenObjects/direct_deposit.screen'
import EditAddressScreen from '../screenObjects/editAddress.screen'
import EditDirectDepositScreen from '../screenObjects/editDirectDeposit.screen'
import EditEmailScreen from '../screenObjects/editEmail.screen'
import EditPhoneNumbersScreen from '../screenObjects/editPhoneNumbers.screen'
import HowDoIUpdateScreen from '../screenObjects/howDoIUpdate.screen'
import HowWillYouScreen from '../screenObjects/howWillYou.screen'
import IncorrectServiceInfoScreen from '../screenObjects/incorrectServiceInfo.screen'
import LettersOverviewScreen from '../screenObjects/lettersOverview.screen'
import MilitaryInformationScreen from '../screenObjects/militaryInformation.screen'
import PersonalInformationScreen from '../screenObjects/personalInformation.screen'
import ProfileScreen from '../screenObjects/profile.screen'
import SettingsScreen from '../screenObjects/settings.screen'

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

    it('should go to the military information page on button click and render its content', async () => {
        let profileMilitaryInfoButton = await ProfileScreen.profileMilitaryInfoButton
        await profileMilitaryInfoButton.click()
        await MilitaryInformationScreen.waitForIsShown()

        let periodOfServiceHeader = await MilitaryInformationScreen.periodOfServiceHeader
        let periodOfServiceHeaderText = await periodOfServiceHeader.getText()
        expect(periodOfServiceHeaderText).toEqual('Period of service')

        let incorrectServiceInfoLink = await MilitaryInformationScreen.incorrectServiceInfoLink
        await expect(incorrectServiceInfoLink.isExisting()).resolves.toEqual(true)

        // Go back to profile screen
        await goBackToPreviousScreen()
        await ProfileScreen.waitForIsShown()
    })

    it('should go to the settings page on button click and render its content', async () => {
        let profileSettingsButton = await ProfileScreen.profileSettingsButton
        await profileSettingsButton.click()
        await delay(1000)
        await SettingsScreen.waitForIsShown()

        let manageAccountButton = await SettingsScreen.settingsManageAccountButton
        await expect(manageAccountButton.isExisting()).resolves.toEqual(true)

        let settingsShareAppButton = await SettingsScreen.settingsShareAppButton
        await expect(settingsShareAppButton.isExisting()).resolves.toEqual(true)

        let settingsPrivacyPolicyButton = await SettingsScreen.settingsPrivacyPolicyButton
        await expect(settingsPrivacyPolicyButton.isExisting()).resolves.toEqual(true)

        // Go back to profile screen
        await goBackToPreviousScreen()
        await ProfileScreen.waitForIsShown()
    })

    it('should go to debug page on button click and render its screen', async () => {
        // Go to settings
        let profileSettingsButton = await ProfileScreen.profileSettingsButton
        await profileSettingsButton.click()
        await SettingsScreen.waitForIsShown()

        // Go to Debug
        let settingsDebugButton = await SettingsScreen.settingsDebugButton
        await settingsDebugButton.click()
        await DebugScreen.waitForIsShown()

        // Go back to settings screen
        await goBackToPreviousScreen()
        await SettingsScreen.waitForIsShown()

        // Go back to profile screen
        await goBackToPreviousScreen()
        await ProfileScreen.waitForIsShown()
    })

    it('should go to the personal information screen and render its content', async () => {
      // Go to personal information screen
      let profilePersonalInfoButton = await ProfileScreen.profilePersonalInfoButton
      await profilePersonalInfoButton.click()
      await PersonalInformationScreen.waitForIsShown()

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

      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()
    })

    it('should go to the how do i update screen from the personal information screen', async () => {
      // Go to personal information screen
      let profilePersonalInfoButton = await ProfileScreen.profilePersonalInfoButton
      await profilePersonalInfoButton.click()
      await PersonalInformationScreen.waitForIsShown()

      // Go to how do I update screen
      let personalInformationHowDoIUpdateLink = await PersonalInformationScreen.personalInformationHowDoIUpdateLink
      await personalInformationHowDoIUpdateLink.click()
      await HowDoIUpdateScreen.waitForIsShown()

      let howDoIUpdateFindVALink = await HowDoIUpdateScreen.howDoIUpdateFindVALink
      await expect(howDoIUpdateFindVALink.isExisting()).resolves.toEqual(true)

      // Go back to personal information screen
      await goBackToPreviousScreen()
      await PersonalInformationScreen.waitForIsShown()

      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()
    })

  it('should go to the how will you screen from the personal information screen', async () => {
    // Go to personal information screen
    const profilePersonalInfoButton = await ProfileScreen.profilePersonalInfoButton
    await profilePersonalInfoButton.click()
    await PersonalInformationScreen.waitForIsShown()

    if (driver.isAndroid) {
      await androidScrollToElementWithText('How will you use my contact information?')
    }

    // Go to how will you screen
    const personalInformationHowWillYouLink = await PersonalInformationScreen.personalInformationHowWillYouLink
    await personalInformationHowWillYouLink.click()
    await HowWillYouScreen.waitForIsShown()

    // Go back to personal information screen
    await goBackToPreviousScreen()
    await PersonalInformationScreen.waitForIsShown()

    // Go back to profile screen
    await goBackToPreviousScreen()
    await ProfileScreen.waitForIsShown()
  })

    it('should go to the incorrect service info screen from military information screen', async () => {
      let profileMilitaryInfoButton = await ProfileScreen.profileMilitaryInfoButton
      await profileMilitaryInfoButton.click()
      await MilitaryInformationScreen.waitForIsShown()

      let incorrectServiceInfoLink = await MilitaryInformationScreen.incorrectServiceInfoLink
      await expect(incorrectServiceInfoLink.isExisting()).resolves.toEqual(true)

      await incorrectServiceInfoLink.click()
      await IncorrectServiceInfoScreen.waitForIsShown()

      let DMDCNumber = await IncorrectServiceInfoScreen.DMDCNumber
      await expect(DMDCNumber.isExisting()).resolves.toEqual(true)

      // Go back to military screen
      await goBackToPreviousScreen()
      await MilitaryInformationScreen.waitForIsShown()

      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()
    })

  describe('Direct Deposit', () => {
    it('should go to page on button click and render its content', async () => {
      const profileDirectDepositButton = await ProfileScreen.profileDirectDepositButton
      await profileDirectDepositButton.click()
      await DirectDepositScreen.waitForIsShown()

      const directDepositInformationHeader = await DirectDepositScreen.directDepositInformationHeader
      const directDepositInformationHeaderText = await directDepositInformationHeader.getText()
      expect(directDepositInformationHeaderText).toEqual('Direct deposit information')

      const directDepositFraudNumber = await DirectDepositScreen.directDepositFraudNumber
      await expect(directDepositFraudNumber.isExisting()).resolves.toEqual(true)

      if (driver.isAndroid) {
        await androidScrollToElementWithText('711')
      }

      const directDepositHearingLossNumber = await DirectDepositScreen.directDepositHearingLossNumber
      await expect(directDepositHearingLossNumber.isExisting()).resolves.toEqual(true)

      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()
    })

    describe('on click of bank account', () => {
      it('should go to the edit direct deposit screen and render its content', async () => {
        const profileDirectDepositButton = await ProfileScreen.profileDirectDepositButton
        await profileDirectDepositButton.click()
        await DirectDepositScreen.waitForIsShown()

        // Go to edit direct deposit screen
        const directDepositBankEdit = await DirectDepositScreen.directDepositBankEdit('bank-of-america-******1234-savings')
        await directDepositBankEdit.click()
        await EditDirectDepositScreen.waitForIsShown()

        // Go back to direct deposit screen
        const cancelButton = await EditDirectDepositScreen.cancelButton
        await cancelButton.click()
        await DirectDepositScreen.waitForIsShown()

        // Go back to profile screen
        await goBackToPreviousScreen()
        await ProfileScreen.waitForIsShown()
      })
    })
  })

  describe('on click of a number on the personal information screen', () => {
    it('should go to the edit phone number screen and render its content', async () => {
      // Go to personal information screen
      let profilePersonalInfoButton = await ProfileScreen.profilePersonalInfoButton
      await profilePersonalInfoButton.click()
      await PersonalInformationScreen.waitForIsShown()

      if (driver.isAndroid) {
        await androidScrollToElementWithText('Phone numbers')
      }

      // Go to edit phone number screen for home
      let personalInformationHomeNumber = await PersonalInformationScreen.personalInformationHomeNumber
      await personalInformationHomeNumber.click()
      await EditPhoneNumbersScreen.waitForIsShown()

      // Go back to personal information screen
      const cancelButton = await EditPhoneNumbersScreen.cancelButton
      await cancelButton.click()
      await PersonalInformationScreen.waitForIsShown()

      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()
    })
  })

  describe('on click of the email on the personal information screen', () => {
    it('should go to the edit email screen and render its content', async () => {
      // Go to personal information screen
      const profilePersonalInfoButton = await ProfileScreen.profilePersonalInfoButton
      await profilePersonalInfoButton.click()
      await PersonalInformationScreen.waitForIsShown()

      if (driver.isAndroid) {
        await androidScrollToElementWithText('Contact email address')
      }

      // Go to edit email screen
      const personalInformationEmail = await PersonalInformationScreen.personalInformationEmailEdit('patient998@id.me')
      await personalInformationEmail.click()
      await EditEmailScreen.waitForIsShown()

      // Go back to personal information screen
      const cancelButton = await EditEmailScreen.cancelButton
      await cancelButton.click()
      await PersonalInformationScreen.waitForIsShown()

      // TODO: test save flow when service is integrated

      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()
    })
  })

  describe('on click of the mailing address on the personal information screen', () => {
    it('should go to the edit address screen and render its content', async () => {
      // Go to personal information screen
      const profilePersonalInfoButton = await ProfileScreen.profilePersonalInfoButton
      await profilePersonalInfoButton.click()
      await PersonalInformationScreen.waitForIsShown()

      if (driver.isAndroid) {
        await androidScrollToElementWithText('Mailing Address')
      }

      // Go to edit address screen
      const personalInformationMailingAddressEdit = await PersonalInformationScreen.personalInformationMailingAddressEdit
      await personalInformationMailingAddressEdit.click()
      await EditAddressScreen.waitForIsShown()

      // Go back to personal information screen
      const cancelButton = await EditEmailScreen.cancelButton
      await cancelButton.click()
      await PersonalInformationScreen.waitForIsShown()

      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()

    })
  })

  describe('on click of the residential address on the personal information screen', () => {
    it('should go to the edit address screen and render its content', async () => {
      // Go to personal information screen
      const profilePersonalInfoButton = await ProfileScreen.profilePersonalInfoButton
      await profilePersonalInfoButton.click()
      await PersonalInformationScreen.waitForIsShown()

      if (driver.isAndroid) {
        await androidScrollToElementWithText('Residential Address')
      }

      // Go to edit address screen
      const personalInformationResidentialAddressEdit = await PersonalInformationScreen.personalInformationResidentialAddressEdit
      await personalInformationResidentialAddressEdit.click()
      await EditAddressScreen.waitForIsShown()

      // Go back to personal information screen
      const cancelButton = await EditEmailScreen.cancelButton
      await cancelButton.click()
      await PersonalInformationScreen.waitForIsShown()

      // Go back to profile screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()

    })
  })

  describe('on click of the letters button on the profile screen', () => {
    it('should go to the letters overview', async () => {
      // Go to letters screen
      const lettersButton = await ProfileScreen.profileLettersAndDocsButton
      await lettersButton.click()
      await LettersOverviewScreen.waitForIsShown()

      // Go to edit address
      const addressButton = await LettersOverviewScreen.lettersMailingAddress
      await addressButton.click()
      await EditAddressScreen.waitForIsShown()

      // Go back to overview
      const cancelButton = await EditEmailScreen.cancelButton
      await cancelButton.click()

      // Go back to personal information screen
      await goBackToPreviousScreen()
      await ProfileScreen.waitForIsShown()
    })
  })
}
