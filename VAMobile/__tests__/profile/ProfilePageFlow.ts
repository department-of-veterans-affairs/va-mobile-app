import ProfileScreen from '../screenObjects/profile.screen'
import HomeScreen from '../screenObjects/home.screen'
import { delay } from '../utils'
import SettingsScreen from '../screenObjects/settings.screen'

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
        let profileBanner = await ProfileScreen.profileBanner
        expect(profileBanner).toBeTruthy()

        let profileBannerSeal = await ProfileScreen.profileBannerSeal
        expect(profileBannerSeal).toBeTruthy()

        let profileBannerName = await ProfileScreen.profileBannerName
        expect(profileBannerName).toBeTruthy()

        let profileBannerBranch = await ProfileScreen.profileBannerBranch
        expect(profileBannerBranch).toBeTruthy()

        let profilePersonalInfoButton = await ProfileScreen.profilePersonalInfoButton
        expect(profilePersonalInfoButton).toBeTruthy()

        let profileMilitaryInfoButton = await ProfileScreen.profileMilitaryInfoButton
        expect(profileMilitaryInfoButton).toBeTruthy()

        let profileDirectDepositButton = await ProfileScreen.profileDirectDepositButton
        expect(profileDirectDepositButton).toBeTruthy()

        let profileLettersAndDocsButton = await ProfileScreen.profileLettersAndDocsButton
        expect(profileLettersAndDocsButton).toBeTruthy()

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
