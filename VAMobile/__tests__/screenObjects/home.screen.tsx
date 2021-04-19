import AppScreen from './app.screen';

const SELECTORS = {
	HOME_SCREEN: '~Home-page',
	VETERAN_CRISIS_LINE_BUTTON: '~talk-to-the-veterans-crisis-line-now',
	CLAIMS_AND_APPEALS_BUTTON: '~claims-and-appeals',
	HEALTH_CARE_BUTTON: '~health-care',
      LETTERS_BUTTON: '~letters',
	CONTACT_VA_BUTTON: '~Contact V-A',
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

	get healthCareButton() {
		return $(SELECTORS.HEALTH_CARE_BUTTON)
	}

      get lettersButton() {
        return $(SELECTORS.LETTERS_BUTTON)
      }

	get contactVAButton() {
		return $(SELECTORS.CONTACT_VA_BUTTON)
	}
}

export default new HomeScreen();
