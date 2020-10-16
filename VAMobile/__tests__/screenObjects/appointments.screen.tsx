import AppScreen from './app.screen';

const SELECTORS = {
	APPOINTMENTS_SCREEN: '~Appointments-screen',
};

class AppointmentsScreen extends AppScreen {
	constructor() {
		super(SELECTORS.APPOINTMENTS_SCREEN)
	}
}

export default new AppointmentsScreen()
