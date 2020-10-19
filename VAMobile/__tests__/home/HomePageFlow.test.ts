import { delay, tabTo } from '../utils'
import HomeScreen from '../screenObjects/home.screen'
import ClaimsScreen from '../screenObjects/claims.screen'
import AppointmentsScreen from '../screenObjects/appointments.screen'
import ContactVAScreen from '../screenObjects/contactVA.screen'

export default () => {
	before(async () => {
		await tabTo('Home')
		await delay(1000)
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

	it('navigate to Claims and appeal and Appointments navigate to Contact VA  screens', async () => {
		const claimsAndAppealsButton = await HomeScreen.claimsAndAppealsButton
		await claimsAndAppealsButton.click()
		await ClaimsScreen.waitForIsShown()

		await tabTo('Home')

		const appointmentsButton = await HomeScreen.appointmentsButton
		await appointmentsButton.click()
		await AppointmentsScreen.waitForIsShown()

		await tabTo('Home')

		const contactVAButton = await HomeScreen.contactVAButton
		await contactVAButton.click()
		ContactVAScreen.waitForIsShown()

	})
}
