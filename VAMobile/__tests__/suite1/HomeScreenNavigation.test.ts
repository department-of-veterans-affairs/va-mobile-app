import { delay } from '../utils'
import HomeScreen from '../screenObjects/home.screen'
import ClaimsScreen from '../screenObjects/claims.screen'

export default () => {
	it('navigate to Claims and appeal', async () => {
		let claimsAndAppealsButton = await HomeScreen.claimsAndAppealButton
		await claimsAndAppealsButton.click()
		await ClaimsScreen.waitForIsShown()
	})
}