import AppScreen from './app.screen'

const SELECTORS = {
  EDIT_ADDRESS_SCREEN: '~Edit-address-screen'
};

class EditAddressScreen extends AppScreen {
  constructor() {
    super(SELECTORS.EDIT_ADDRESS_SCREEN)
  }
}

export default new EditAddressScreen()
