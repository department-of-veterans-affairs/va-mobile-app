import AppScreen from './app.screen';

const SELECTORS = {
	CLAIMS_SCREEN: '~Claims-screen',
};

class ClaimsScreen extends AppScreen {
	constructor() {
		super(SELECTORS.CLAIMS_SCREEN)
	}
}

export default new ClaimsScreen()
