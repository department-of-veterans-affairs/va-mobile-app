import HomeScreen from '../screenObjects/home.screen'

export default () => {

	it('preses counter', async () => {
		await HomeScreen.waitForIsShown()
	})

}
