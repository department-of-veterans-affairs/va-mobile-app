import AppScreen from './app.screen';

const SELECTORS = {
  UPCOMING_APPOINTMENTS_SCREEN: '~Upcoming-appointments'
};

class UpcomingAppointmentsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.UPCOMING_APPOINTMENTS_SCREEN)
  }

  upcomingApptHomeAppointmentType(homeApptID: string) {
    return $(homeApptID)
  }
}

export default new UpcomingAppointmentsScreen()
