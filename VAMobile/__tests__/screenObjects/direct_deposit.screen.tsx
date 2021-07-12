import AppScreen from './app.screen'

const SELECTORS = {
  DIRECT_DEPOSIT_SCREEN: '~Direct-deposit-page',
  DIRECT_DEPOSIT_ADD_BANK_INFO: `~account-add-your-bank-account-information`,
  DIRECT_DEPOSIT_BANK_INFO: `~account-`,
}

class DirectDepositScreen extends AppScreen {
  constructor() {
    super(SELECTORS.DIRECT_DEPOSIT_SCREEN)
  }

  directDepositBankEdit(bankInfo?: string) {
    return bankInfo ? $(SELECTORS.DIRECT_DEPOSIT_BANK_INFO + bankInfo) : $(SELECTORS.DIRECT_DEPOSIT_ADD_BANK_INFO)
  }
}

export default new DirectDepositScreen()
