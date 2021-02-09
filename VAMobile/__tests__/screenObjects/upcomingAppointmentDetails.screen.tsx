import AppScreen from './app.screen';

const SELECTORS = {
  UPCOMING_APPOINTMENTS_DETAILS_SCREEN: '~Appointment-details-page',
  UPCOMING_APPOINTMENTS_DETAILS_PREPARE_VIDEO_VISIT: '~Prepare for video visit'
};

class UpcomingAppointmentsDetailsScreen extends AppScreen {
  constructor() {
    super(SELECTORS.UPCOMING_APPOINTMENTS_DETAILS_SCREEN)
  }

  get upcomingApptDetailsPrepareForVideoVisitLink() {
    return $(SELECTORS.UPCOMING_APPOINTMENTS_DETAILS_PREPARE_VIDEO_VISIT)
  }
}

export default new UpcomingAppointmentsDetailsScreen()
