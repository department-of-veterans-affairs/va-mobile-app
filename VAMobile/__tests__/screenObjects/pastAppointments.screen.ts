import AppScreen from './app.screen';

const SELECTORS = {
  PAST_APPOINTMENTS_SCREEN: '~Past-appointments',
};

class PastAppointmentsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PAST_APPOINTMENTS_SCREEN)
  }
}

export default new PastAppointmentsScreen()
