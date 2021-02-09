import AppScreen from './app.screen';

const SELECTORS = {
	APPOINTMENTS_SCREEN: '~Appointments-page',
      APPOINTMENTS_UPCOMING_TAB: '~Upcoming',
      APPOINTMENTS_PAST_TAB: '~Past',
};

class AppointmentsScreen extends AppScreen {
	constructor() {
		super(SELECTORS.APPOINTMENTS_SCREEN)
	}

	get appointmentsUpcomingTab() {
	  return $(SELECTORS.APPOINTMENTS_UPCOMING_TAB)
  }

      get appointmentsPastTab() {
        return $(SELECTORS.APPOINTMENTS_PAST_TAB)
      }
}

export default new AppointmentsScreen()
