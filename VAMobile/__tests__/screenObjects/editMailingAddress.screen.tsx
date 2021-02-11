import AppScreen from './app.screen'

const SELECTORS = {
  EDIT_ADDRESS_SCREEN: '~Mailing-address: Edit-address-page'
};

class EditMailingAddressScreen extends AppScreen {
  constructor() {
    super(SELECTORS.EDIT_ADDRESS_SCREEN)
  }
}

export default new EditMailingAddressScreen()
