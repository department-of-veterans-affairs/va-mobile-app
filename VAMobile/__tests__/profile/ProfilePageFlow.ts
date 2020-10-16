import ProfileScreen from '../screenObjects/profile.screen'
import { androidScrollToElementWithText, delay, tabTo } from '../utils'
import SettingsScreen from '../screenObjects/settings.screen'
import DirectDepositScreen from '../screenObjects/direct_deposit.screen'

export default () => {

    before(async () => {
        tabTo('Profile')
        await delay(1000)
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
        let backButton = await DirectDepositScreen.directDepositBackButton
        await backButton.click()
        await delay(1000)
        await ProfileScreen.waitForIsShown()
    })

    it('should go to the settings page on button click and render its content', async () => {
        let profileSettingsButton = await ProfileScreen.profileSettingsButton
        await profileSettingsButton.click()
        await delay(1000)
        await SettingsScreen.waitForIsShown()

        let manageAccountButton = await SettingsScreen.settingsManageAccountButton
        await expect(manageAccountButton.isExisting()).resolves.toEqual(true)

        let settingsTouchIDButton = await SettingsScreen.settingsTouchIDButton
        await expect(settingsTouchIDButton.isExisting()).resolves.toEqual(true)

        let settingsShareAppButton = await SettingsScreen.settingsShareAppButton
        await expect(settingsShareAppButton.isExisting()).resolves.toEqual(true)

        let settingsPrivacyPolicyButton = await SettingsScreen.settingsPrivacyPolicyButton
        await expect(settingsPrivacyPolicyButton.isExisting()).resolves.toEqual(true)

        // Go back to profile screen
        let settingsBackButton = await SettingsScreen.settingsBackButton
        await settingsBackButton.click()
        await delay(1000)
        await ProfileScreen.waitForIsShown()
    })
}
