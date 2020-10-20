import {delay, goBackToPreviousScreen, tabTo} from '../utils'
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

    it('should navigate to the Veterans Crisis Line Screen on click of the veterans crisis line banner on the home page', async () => {
        const veteranCrisisLineButton = await HomeScreen.veteranCrisisLineButton
        await veteranCrisisLineButton.click()
        await delay(1000)
        await VeteransCrisisLineScreen.waitForIsShown()

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

        await goBackToPreviousScreen()
        await HomeScreen.waitForIsShown()
    })

    it('should navigate to the Veterans Crisis Line Screen on click of the veterans crisis line banner on the Contact VA Screen', async () => {
        const contactVAButton = await HomeScreen.contactVAButton
        await contactVAButton.click()
        await delay(1000)
        await ContactVAScreen.waitForIsShown()

        const veteranCrisisLineButton = await HomeScreen.veteranCrisisLineButton
        await veteranCrisisLineButton.click()
        await delay(1000)
        await VeteransCrisisLineScreen.waitForIsShown()

        // Go back to contact VA
        await goBackToPreviousScreen()
        await ContactVAScreen.waitForIsShown()

        // Go back to home
        await goBackToPreviousScreen()
        await HomeScreen.waitForIsShown()
    })

	it('navigate to Claims and appeal and Appointments navigate to Contact VA  screens', async () => {
		const claimsAndAppealsButton = await HomeScreen.claimsAndAppealsButton
		await claimsAndAppealsButton.click()
        await delay(1000)
		await ClaimsScreen.waitForIsShown()

		await tabTo('Home')

		const appointmentsButton = await HomeScreen.appointmentsButton
		await appointmentsButton.click()
        await delay(1000)
		await AppointmentsScreen.waitForIsShown()

		await tabTo('Home')

		const contactVAButton = await HomeScreen.contactVAButton
		await contactVAButton.click()
		ContactVAScreen.waitForIsShown()

	})
}
