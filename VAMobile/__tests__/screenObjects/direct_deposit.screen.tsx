import AppScreen from './app.screen'

const SELECTORS = {
    DIRECT_DEPOSIT_SCREEN: '~Direct-deposit-screen',
    DIRECT_DEPOSIT_BACK: '~back'
}

class DirectDepositScreen extends AppScreen {
    constructor() {
        super(SELECTORS.DIRECT_DEPOSIT_SCREEN)
    }

    get directDepositBackButton() {
        return $(SELECTORS.DIRECT_DEPOSIT_BACK)
    }

}

export default new DirectDepositScreen()
