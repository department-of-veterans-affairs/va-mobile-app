import AppScreen from './app.screen'

const SELECTORS = {
	DEBUG_SCREEN: '~Debug-page',
}

class DebugScreen extends AppScreen {
	constructor() {
		super(SELECTORS.DEBUG_SCREEN)
	}
}

export default new DebugScreen()
