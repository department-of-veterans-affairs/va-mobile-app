import AppScreen from './app.screen';

const SELECTORS = {
  PAST_APPOINTMENT_DETAILS_SCREEN: '~Past-appointment-details-page',
};

class PastAppointmentDetailsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PAST_APPOINTMENT_DETAILS_SCREEN)
  }
}

export default new PastAppointmentDetailsScreen()
