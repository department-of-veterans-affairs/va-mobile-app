import AppScreen from './app.screen';

const SELECTORS = {
  PAST_APPOINTMENTS_SCREEN: '~Past-appointments-page',
  NO_PAST_APPOINTMENTS_SCREEN: '~Appointments: No-appointments-page',
};

class PastAppointmentsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PAST_APPOINTMENTS_SCREEN)
  }

  getPastApptWithID(apptID: string) {
    return $(apptID)
  }

  get noPastApptScreen() {
    return $(SELECTORS.NO_PAST_APPOINTMENTS_SCREEN)
  }
}

export default new PastAppointmentsScreen()
