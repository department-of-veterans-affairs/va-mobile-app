import AppScreen from './app.screen';

const SELECTORS = {
	HOME_SCREEN: '~Home-screen',
	DETAILS_BUTTON: '~Home-details-button',
	CLAIMS_AND_APPEAL_BUTTON: '~claims-and-appeals-home-nav-button',
    PROFILE_NAV_OPTION: '~Profile-nav-option',
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

    get profileNavOption() {
        return $(SELECTORS.PROFILE_NAV_OPTION)
    }
}

export default new HomeScreen();
