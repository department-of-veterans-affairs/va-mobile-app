import AppScreen from './app.screen';

const SELECTORS = {
	LOGIN_SCREEN: '~Login-page',
	LOGIN_BUTTON: "~Login-button",
};

class LoginScreen extends AppScreen {
	constructor() {
		super(SELECTORS.LOGIN_SCREEN)
	}

	get loginButton() {
		return $(SELECTORS.LOGIN_BUTTON)
	}

}

export default new LoginScreen()
