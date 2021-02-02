import AppScreen from './app.screen';

const SELECTORS = {
  PAST_APPOINTMENTS_SCREEN: '~Past-appointments',
  NO_PAST_APPOINTMENTS_SCREEN: '~No-appointments-screen',
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
