import AppScreen from './app.screen';

const SELECTORS = {
  HEALTH_SCREEN: '~Health-care-page',
  HEALTH_APPOINTMENTS_BUTTON: '~appointments',
  HEALTH_MESSAGES_BUTTON: '~messages'
};

class HealthScreen extends AppScreen {
  constructor() {
    super(SELECTORS.HEALTH_SCREEN)
  }

  get appointmentsButton () {
    return $(SELECTORS.HEALTH_APPOINTMENTS_BUTTON)
  }

  get messagesButton () {
    return $(SELECTORS.HEALTH_MESSAGES_BUTTON)
  }
}

export default new HealthScreen()
