import AppScreen from './app.screen';

const SELECTORS = {
  UPCOMING_APPOINTMENTS_SCREEN: '~Upcoming-appointments-page',
  NO_UPCOMING_APPOINTMENTS_SCREEN: '~Appointments: No-appointments-page',
};

class UpcomingAppointmentsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.UPCOMING_APPOINTMENTS_SCREEN)
  }

  upcomingApptHomeAppointmentType(homeApptID: string) {
    return $(homeApptID)
  }

  get noUpcomingApptScreen() {
    return $(SELECTORS.NO_UPCOMING_APPOINTMENTS_SCREEN)
  }
}

export default new UpcomingAppointmentsScreen()
