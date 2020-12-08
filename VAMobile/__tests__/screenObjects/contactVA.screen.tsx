import AppScreen from './app.screen';

const SELECTORS = {
	CONTACT_VA_SCREEN: '~Contact-VA-screen',
}

class ContactVAScreen extends AppScreen {
	constructor() {
		super(SELECTORS.CONTACT_VA_SCREEN)
	}
}

export default new ContactVAScreen()
