import AppScreen from './app.screen';

const SELECTORS = {
  HEALTH_SCREEN: '~Health-care-page',
  HEALTH_APPOINTMENTS_BUTTON: '~appointments',
  HEALTH_MESSAGES_BUTTON: '~messages-you-have-0-unread-messages',
}

class HealthScreen extends AppScreen {
  constructor() {
    super(SELECTORS.HEALTH_SCREEN)
  }

  get appointmentsButton() {
    return $(SELECTORS.HEALTH_APPOINTMENTS_BUTTON)
  }

  // TODO pass a parameter to support unread message count
  messagesButton(unreadCount?: number) {
    return $(unreadCount ? `~messages-you-have-${unreadCount}-unread-messages` : SELECTORS.HEALTH_MESSAGES_BUTTON)
  }
}

export default new HealthScreen()
