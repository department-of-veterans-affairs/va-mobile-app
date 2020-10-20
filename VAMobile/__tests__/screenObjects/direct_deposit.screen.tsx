import AppScreen from './app.screen'

const SELECTORS = {
    DIRECT_DEPOSIT_SCREEN: '~Direct-deposit-screen',
    DIRECT_DEPOSIT_INFORMATION_HEADER: '~direct-deposit-information',
    DIRECT_DEPOSIT_FRAUD_NUMBER: '~800-827-1000',
    DIRECT_DEPOSIT_HEARING_LOSS_NUMBER: '~711',
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

}

export default new DirectDepositScreen()
