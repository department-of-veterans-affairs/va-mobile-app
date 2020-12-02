import AppScreen from './app.screen';

const SELECTORS = {
  PAST_APPOINTMENTS_SCREEN: '~Past-appointments',
};

class PastAppointmentsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PAST_APPOINTMENTS_SCREEN)
  }

  getPastApptWithID(apptID: string) {
    return $(apptID)
  }
}

export default new PastAppointmentsScreen()
