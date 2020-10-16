import AppScreen from './app.screen';

const SELECTORS = {
	CONTACT_VA_SCREEN: '~ContactVA-screen',
}

class ContactVAScreen extends AppScreen {
	constructor() {
		super(SELECTORS.CONTACT_VA_SCREEN)
	}
}

export default new ContactVAScreen()
