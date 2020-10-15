import ProfileScreen from '../screenObjects/profile.screen'
import HomeScreen from '../screenObjects/home.screen'
import { androidScrollToElementWithText, delay } from '../utils'
import SettingsScreen from '../screenObjects/settings.screen'
import DirectDepositScreen from '../screenObjects/direct_deposit.screen'

export default () => {

    before(async () => {
        let profileNavOption = await HomeScreen.profileNavOption
        let out = await profileNavOption.waitForExist({ timeout: 5000 })
        expect(out).toEqual(true)

        await profileNavOption.click()
        await delay(1000)
        await ProfileScreen.waitForIsShown()
    })

    it('should render the profile page', async () => {
        let profilePersonalInfoButton = await ProfileScreen.profilePersonalInfoButton
        let profilePersonalInfoButtonIsExisting = await profilePersonalInfoButton.isExisting()
        expect(profilePersonalInfoButtonIsExisting).toEqual(true)

        let profileMilitaryInfoButton = await ProfileScreen.profileMilitaryInfoButton
        let profileMilitaryInfoButtonIsExisting = await profileMilitaryInfoButton.isExisting()
        expect(profileMilitaryInfoButtonIsExisting).toEqual(true)

        let profileDirectDepositButton = await ProfileScreen.profileDirectDepositButton
        let profileDirectDepositButtonIsExisting = await profileDirectDepositButton.isExisting()
        expect(profileDirectDepositButtonIsExisting).toEqual(true)

        let profileLettersAndDocsButton = await ProfileScreen.profileLettersAndDocsButton
        let profileLettersAndDocsButtonIsExisting = await profileLettersAndDocsButton.isExisting()
        expect(profileLettersAndDocsButtonIsExisting).toEqual(true)

        let profileSettingsButton = await ProfileScreen.profileSettingsButton
        let profileSettingsButtonIsExisting = await profileSettingsButton.isExisting()
        expect(profileSettingsButtonIsExisting).toEqual(true)
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
        let fraudNumberIsExisting = await directDepositFraudNumber.isExisting()
        expect(fraudNumberIsExisting).toEqual(true)

        if (driver.isAndroid) {
            await androidScrollToElementWithText('711')
        }

        let directDepositHearingLossNumber = await DirectDepositScreen.directDepositHearingLossNumber
        let directDepositHearingLossNumberIsExisting = await directDepositHearingLossNumber.isExisting()
        expect(directDepositHearingLossNumberIsExisting).toEqual(true)

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
        let manageAccountButtinIsExisting = await manageAccountButton.isExisting()
        expect(manageAccountButtinIsExisting).toEqual(true)

        let settingsTouchIDButton = await SettingsScreen.settingsTouchIDButton
        let settingsTouchIDButtonIsExisting = await settingsTouchIDButton.isExisting()
        expect(settingsTouchIDButtonIsExisting).toEqual(true)

        let settingsShareAppButton = await SettingsScreen.settingsShareAppButton
        let settingsShareAppButtonIsExisting = await settingsShareAppButton.isExisting()
        expect(settingsShareAppButtonIsExisting).toEqual(true)

        let settingsPrivacyPolicyButton = await SettingsScreen.settingsPrivacyPolicyButton
        let settingsPrivacyPolicyButtonIsExisting = await settingsPrivacyPolicyButton.isExisting()
        expect(settingsPrivacyPolicyButtonIsExisting).toEqual(true)

        // Go back to profile screen
        let settingsBackButton = await SettingsScreen.settingsBackButton
        await settingsBackButton.click()
        await delay(1000)
        await ProfileScreen.waitForIsShown()
    })
}
