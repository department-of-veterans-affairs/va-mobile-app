import AppScreen from './app.screen';

const SELECTORS = {
	HOME_SCREEN: '~Home-screen',
	VETERAN_CRISIS_LINE_BUTTON: `~crisis-line-button`,
	CLAIMS_AND_APPEALS_BUTTON: '~claims-and-appeals-home-nav-button',
	APPOINTMENTS_BUTTON: '~appointments-home-nav-button',
	CONTACT_VA_BUTTON: '~contact-va',
};

class HomeScreen extends AppScreen {
	constructor() {
		super(SELECTORS.HOME_SCREEN)
	}

	get veteranCrisisLineButton() {
		return $(SELECTORS.VETERAN_CRISIS_LINE_BUTTON)
	}

	get claimsAndAppealsButton() {
		return $(SELECTORS.CLAIMS_AND_APPEALS_BUTTON)
	}

	get appointmentsButton() {
		return $(SELECTORS.APPOINTMENTS_BUTTON)
	}

	get contactVAButton() {
		return $(SELECTORS.CONTACT_VA_BUTTON)
	}
}

export default new HomeScreen();
