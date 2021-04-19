import {androidScrollToElementWithText, goBackToPreviousScreen, tabTo} from '../utils'
import HomeScreen from '../screenObjects/home.screen'
import ClaimsScreen from '../screenObjects/claims.screen'
import HealthScreen from '../screenObjects/health.screen'
import ContactVAScreen from '../screenObjects/contactVA.screen'
import VeteransCrisisLineScreen from '../screenObjects/veteransCrisisLine.screen'
import LettersOverviewScreen from '../screenObjects/lettersOverview.screen'

export default () => {
  before(async () => {
		await tabTo('Home')
		await HomeScreen.waitForIsShown()
	})

	it('should render its content', async () => {
		const veteranCrisisLineButton = await HomeScreen.veteranCrisisLineButton
		await veteranCrisisLineButton.waitForDisplayed()

		const claimsAndAppealsButton = await  HomeScreen.claimsAndAppealsButton
		await claimsAndAppealsButton.waitForDisplayed()

		const healthCareButton = await HomeScreen.healthCareButton
		await healthCareButton.waitForDisplayed()

              const lettersButton = await HomeScreen.lettersButton
              await lettersButton.waitForDisplayed()
	})

  describe('Veterans Crisis Line Banner', () => {
    before(async () => {
      // Go to veterans crisis line page
      const veteranCrisisLineButton = await HomeScreen.veteranCrisisLineButton
      await veteranCrisisLineButton.click()
      await VeteransCrisisLineScreen.waitForIsShown()
    })

    after(async () => {
      // Go back to home page
      await goBackToPreviousScreen()
      await HomeScreen.waitForIsShown()
    })

    it('should navigate to the Veterans Crisis Line Screen on click of the veterans crisis line banner', async () => {
      const crisisLineCallNum = await VeteransCrisisLineScreen.crisisLineCallNum
      await expect(crisisLineCallNum.isExisting()).resolves.toEqual(true)

      const crisisLineTextNum = await VeteransCrisisLineScreen.crisisLineTextNum
      await expect(crisisLineTextNum.isExisting()).resolves.toEqual(true)

      const crisisLineStartChat = await VeteransCrisisLineScreen.crisisLineStartChat
      await expect(crisisLineStartChat.isExisting()).resolves.toEqual(true)

      const crisisLineTTY = await VeteransCrisisLineScreen.crisisLineTTY
      await expect(crisisLineTTY.isExisting()).resolves.toEqual(true)

      const crisisLineSite = await VeteransCrisisLineScreen.crisisLineSite
      await expect(crisisLineSite.isExisting()).resolves.toEqual(true)
    })
  })

  describe('Claims and appeals', () => {
    after(async () => {
      await tabTo('Home')
    })

    it('should navigate to Claims tab on click of claims and appeals button', async () => {
      const claimsAndAppealsButton = await HomeScreen.claimsAndAppealsButton
      await claimsAndAppealsButton.click()
      await ClaimsScreen.waitForIsShown()
    })
  })

  describe('Health care', () => {
    after(async () => {
      await tabTo('Home')
    })

    it('should navigate to the Health tab on click of the Health button', async () => {
      const healthCareButton = await HomeScreen.healthCareButton
      await healthCareButton.click()
      await HealthScreen.waitForIsShown()
    })
  })

  describe('Letters', () => {
    after(async () => {
      await goBackToPreviousScreen()
      await HomeScreen.waitForIsShown()
    })

    it('should navigate to the letters screen on click of the Letters button', async () => {
      const lettersButton = await HomeScreen.lettersButton
      await lettersButton.click()
      await LettersOverviewScreen.waitForIsShown()
    })
  })

  describe('Contact VA', () => {
    before(async () => {
      // Go to Contact VA page
      if (driver.isAndroid) {
        await androidScrollToElementWithText('Contact VA')
      }
      const contactVAButton = await HomeScreen.contactVAButton
      await contactVAButton.click()
      await ContactVAScreen.waitForIsShown()
    })

    after(async () => {
      // Go back to home page
      await goBackToPreviousScreen()
      await HomeScreen.waitForIsShown()
    })

    it('should navigate to the Veterans Crisis Line Screen on click of the veterans crisis line banner', async () => {
      const veteranCrisisLineButton = await HomeScreen.veteranCrisisLineButton
      await veteranCrisisLineButton.click()
      await VeteransCrisisLineScreen.waitForIsShown()

      // Go back to contact VA
      await goBackToPreviousScreen()
      await ContactVAScreen.waitForIsShown()
    })
  })
}
