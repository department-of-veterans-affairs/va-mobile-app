import AppScreen from './app.screen'

const SELECTORS = {
  EDIT_ADDRESS_SCREEN: '~Residential-address: Edit-address-page'
};

class EditResidentialAddressScreen extends AppScreen {
  constructor() {
    super(SELECTORS.EDIT_ADDRESS_SCREEN)
  }
}

export default new EditResidentialAddressScreen()
