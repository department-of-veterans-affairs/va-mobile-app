import ProfileScreen from '../screenObjects/profile.screen'
import HomeScreen from '../screenObjects/home.screen'
import { delay } from '../utils'
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

    it('should go through the profile page flow and render its content', async () => {
        let profilePersonalInfoButton = await ProfileScreen.profilePersonalInfoButton
        expect(profilePersonalInfoButton).toBeTruthy()

        let profileMilitaryInfoButton = await ProfileScreen.profileMilitaryInfoButton
        expect(profileMilitaryInfoButton).toBeTruthy()

        // Go to direct deposit screen
        let profileDirectDepositButton = await ProfileScreen.profileDirectDepositButton
        expect(profileDirectDepositButton).toBeTruthy()
        await profileDirectDepositButton.click()
        await delay(1000)
        await DirectDepositScreen.waitForIsShown()

        let backButton = await DirectDepositScreen.directDepositBackButton
        expect(backButton).toBeTruthy()
        await backButton.click()
        await delay(1000)
        await ProfileScreen.waitForIsShown()

        let profileLettersAndDocsButton = await ProfileScreen.profileLettersAndDocsButton
        expect(profileLettersAndDocsButton).toBeTruthy()

        // Go to settings screen
        let profileSettingsButton = await ProfileScreen.profileSettingsButton
        expect(profileSettingsButton).toBeTruthy()
        await profileSettingsButton.click()
        await delay(1000)
        await SettingsScreen.waitForIsShown()

        let settingsBackButton = await SettingsScreen.settingsBackButton
        expect(settingsBackButton).toBeTruthy()
        await settingsBackButton.click()
        await delay(1000)
        await ProfileScreen.waitForIsShown()
    })

}
