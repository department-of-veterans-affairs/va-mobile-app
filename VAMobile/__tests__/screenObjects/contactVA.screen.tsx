import AppScreen from './app.screen';

const SELECTORS = {
	CONTACT_VA_SCREEN: '~Contact-V-A-page',
}

class ContactVAScreen extends AppScreen {
	constructor() {
		super(SELECTORS.CONTACT_VA_SCREEN)
	}
}

export default new ContactVAScreen()
