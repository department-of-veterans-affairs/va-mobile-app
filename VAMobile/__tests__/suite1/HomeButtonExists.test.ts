import HomeScreen from '../screenObjects/home.screen'

export default () => {
	
	it('Home Screen', async () => {
		await HomeScreen.waitForIsShown()
	})

}