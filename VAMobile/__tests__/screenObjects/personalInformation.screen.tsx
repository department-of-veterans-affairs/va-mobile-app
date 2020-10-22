import AppScreen from './app.screen';

const SELECTORS = {
  PERSONAL_INFORMATION_SCREEN: '~Personal-information-screen',
  PERSONAL_INFORMATION_HEADER: '~personal-information',
  PERSONAL_INFORMATION_ADDRESSES_HEADER: '~addresses',
  PERSONAL_INFORMATION_PHONE_NUMBERS_HEADER: '~phone-numbers',
  PERSONAL_INFORMATION_CONTACT_EMAIL_HEADER: '~contact-email-address',
};

class PersonalInformationScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PERSONAL_INFORMATION_SCREEN)
  }

  get personalInformationHeader () {
    return $(SELECTORS.PERSONAL_INFORMATION_HEADER)
  }

  get personalInformationAddressesHeader () {
    return $(SELECTORS.PERSONAL_INFORMATION_ADDRESSES_HEADER)
  }

  get personalInformationPhoneNumbersHeader () {
    return $(SELECTORS.PERSONAL_INFORMATION_PHONE_NUMBERS_HEADER)
  }

  get personalInformationContactEmailHeader () {
    return $(SELECTORS.PERSONAL_INFORMATION_CONTACT_EMAIL_HEADER)
  }
}

export default new PersonalInformationScreen();
