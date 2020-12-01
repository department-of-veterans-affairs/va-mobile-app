import AppScreen from './app.screen';

const SELECTORS = {
  UPCOMING_APPOINTMENTS_SCREEN: '~Upcoming-appointments',
  UPCOMING_APPOINTMENTS_HOME_APPOINTMENT: '~wednesday,-august-11,-2021-1:15-pm-pdt-va-video-connect-at-home'
};

class UpcomingAppointmentsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.UPCOMING_APPOINTMENTS_SCREEN)
  }

  get upcomingApptHomeAppointmentType() {
    return $(SELECTORS.UPCOMING_APPOINTMENTS_HOME_APPOINTMENT)
  }
}

export default new UpcomingAppointmentsScreen()
