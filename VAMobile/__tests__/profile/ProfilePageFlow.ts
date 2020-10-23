import ProfileScreen from '../screenObjects/profile.screen'
import { androidScrollToElementWithText, delay, goBackToPreviousScreen, tabTo } from '../utils'
import SettingsScreen from '../screenObjects/settings.screen'
import DirectDepositScreen from '../screenObjects/direct_deposit.screen'
import DebugScreen from '../screenObjects/debug.screen'
import PersonalInformationScreen from '../screenObjects/personalInformation.screen'
import HowDoIUpdateScreen from '../screenObjects/howDoIUpdate.screen'

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

    it('should go to the direct deposit page on button click and render its content', async () => {
        let profileDirectDepositButton = await ProfileScreen.profileDirectDepositButton
        await profileDirectDepositButton.click()
        await delay(1000)
        await DirectDepositScreen.waitForIsShown()

        let directDepositInformationHeader = await DirectDepositScreen.directDepositInformationHeader
        let directDepositInformationHeaderText = await directDepositInformationHeader.getText()
        expect(directDepositInformationHeaderText).toEqual('Direct deposit information')

        let directDepositFraudNumber = await DirectDepositScreen.directDepositFraudNumber
        await expect(directDepositFraudNumber.isExisting()).resolves.toEqual(true)

        if (driver.isAndroid) {
            await androidScrollToElementWithText('711')
        }

        let directDepositHearingLossNumber = await DirectDepositScreen.directDepositHearingLossNumber
        await expect(directDepositHearingLossNumber.isExisting()).resolves.toEqual(true)

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
}
