import AppScreen from './app.screen';

const SELECTORS = {
	HOME_SCREEN: '~Home-screen',
	DETAILS_BUTTON: '~Home-details-button',
};

class HomeScreen extends AppScreen {
	constructor() {
		super(SELECTORS.HOME_SCREEN);
	}

	get button() {
		return $(SELECTORS.DETAILS_BUTTON);
	}

}

export default new HomeScreen();
