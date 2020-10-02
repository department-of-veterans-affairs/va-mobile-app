import AppScreen from './app.screen';

const SELECTORS = {
	LOGIN_SCREEN: '~Login-screen',
	LOGIN_BUTTON: "~Login-button",
	SAVE_TYPE_PROMPT_MODAL: "~Login-select-save-type-modal",
	SAVE_BIO_BUTTON: "~Login-selectSecurity-bio",
	SAVE_NO_BIO_BUTTON: "~Login-selectSecurity-none",
};

class LoginScreen extends AppScreen {
	constructor() {
		super(SELECTORS.LOGIN_SCREEN)
	}

	get loginButton() {
		return $(SELECTORS.LOGIN_BUTTON)
	}
	
	get saveTypeModal() {
		return $(SELECTORS.SAVE_TYPE_PROMPT_MODAL)
	}
	
	get saveWithBioButton() {
		return $(SELECTORS.SAVE_BIO_BUTTON)
	}
	
	get saveWithoutBioButton() {
		return $(SELECTORS.SAVE_NO_BIO_BUTTON)
	}

}

export default new LoginScreen()
