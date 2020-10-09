import AppScreen from './app.screen';

const SELECTORS = {
	HOME_SCREEN: '~Home-screen',
	DETAILS_BUTTON: '~Home-details-button',
	CLAIMS_AND_APPEAL_BUTTON: '~claims-and-appeals-home-nav-button',
};

class HomeScreen extends AppScreen {
	constructor() {
		super(SELECTORS.HOME_SCREEN);
	}

	get button() {
		return $(SELECTORS.DETAILS_BUTTON);
	}

	get claimsAndAppealButton() {
		return $(SELECTORS.CLAIMS_AND_APPEAL_BUTTON);
	}
}

export default new HomeScreen();
