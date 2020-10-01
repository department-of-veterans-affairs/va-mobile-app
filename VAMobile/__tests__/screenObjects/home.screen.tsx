import AppScreen from './app.screen';

const SELECTORS = {
	HOME_SCREEN: '~Home-screen',
	BUTTON: "~button"
};

class HomeScreen extends AppScreen {
	constructor() {
		super(SELECTORS.HOME_SCREEN);
	}

	get button() {
		return $(SELECTORS.BUTTON);
	}

}

export default new HomeScreen();
