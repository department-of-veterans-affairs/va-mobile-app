import AppScreen from './app.screen'

const SELECTORS = {
  DIRECT_DEPOSIT_SCREEN: '~Direct-deposit-page',
  DIRECT_DEPOSIT_INFORMATION_HEADER: '~direct-deposit-information',
  DIRECT_DEPOSIT_FRAUD_NUMBER: '~800-827-1000',
  DIRECT_DEPOSIT_HEARING_LOSS_NUMBER: '~711',
  DIRECT_DEPOSIT_ADD_BANK_INFO: `~account-add-your-bank-account-information`,
  DIRECT_DEPOSIT_BANK_INFO: `~account-`,
}

class DirectDepositScreen extends AppScreen {
  constructor() {
    super(SELECTORS.DIRECT_DEPOSIT_SCREEN)
  }

  get directDepositInformationHeader() {
    return $(SELECTORS.DIRECT_DEPOSIT_INFORMATION_HEADER)
  }

  get directDepositFraudNumber() {
    return $(SELECTORS.DIRECT_DEPOSIT_FRAUD_NUMBER)
  }

  get directDepositHearingLossNumber() {
    return $(SELECTORS.DIRECT_DEPOSIT_HEARING_LOSS_NUMBER)
  }

  directDepositBankEdit(bankInfo?: string) {
    return bankInfo ? $(SELECTORS.DIRECT_DEPOSIT_BANK_INFO + bankInfo) : $(SELECTORS.DIRECT_DEPOSIT_ADD_BANK_INFO)
  }
}

export default new DirectDepositScreen()
