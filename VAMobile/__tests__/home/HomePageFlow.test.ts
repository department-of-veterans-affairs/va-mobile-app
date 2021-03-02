import { goBackToPreviousScreen, tabTo } from '../utils'
import HomeScreen from '../screenObjects/home.screen'
import ClaimsScreen from '../screenObjects/claims.screen'
import AppointmentsScreen from '../screenObjects/appointments.screen'
import ContactVAScreen from '../screenObjects/contactVA.screen'
import VeteransCrisisLineScreen from '../screenObjects/veteransCrisisLine.screen'

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

		const appointmentsButton = await HomeScreen.appointmentsButton
		await appointmentsButton.waitForDisplayed()

		const contactVAButton = await HomeScreen.contactVAButton
		await contactVAButton.waitForDisplayed()
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

  // describe('Claims and appeals', () => {
  //   after(async () => {
  //     await tabTo('Home')
  //   })
  //
  //   it('should navigate to Claims tab on click of claims and appeals button', async () => {
  //     const claimsAndAppealsButton = await HomeScreen.claimsAndAppealsButton
  //     await claimsAndAppealsButton.click()
  //     await ClaimsScreen.waitForIsShown()
  //   })
  // })
  //
  // describe('Appointments', () => {
  //   after(async () => {
  //     await tabTo('Home')
  //   })
  //
  //   it('should navigate to the Appointments tab on click of the Appointments button', async () => {
  //     const appointmentsButton = await HomeScreen.appointmentsButton
  //     await appointmentsButton.click()
  //     await AppointmentsScreen.waitForIsShown()
  //   })
  // })

  // describe('Contact VA', () => {
  //   before(async () => {
  //     // Go to Contact VA page
  //     const contactVAButton = await HomeScreen.contactVAButton
  //     await contactVAButton.click()
  //     await ContactVAScreen.waitForIsShown()
  //   })
  //
  //   after(async () => {
  //     // Go back to home page
  //     await goBackToPreviousScreen()
  //     await HomeScreen.waitForIsShown()
  //   })
  //
  //   it('should navigate to the Veterans Crisis Line Screen on click of the veterans crisis line banner', async () => {
  //     const veteranCrisisLineButton = await HomeScreen.veteranCrisisLineButton
  //     await veteranCrisisLineButton.click()
  //     await VeteransCrisisLineScreen.waitForIsShown()
  //
  //     // Go back to contact VA
  //     await goBackToPreviousScreen()
  //     await ContactVAScreen.waitForIsShown()
  //   })
  // })
}
