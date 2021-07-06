import AppScreen from './app.screen'

const SELECTORS = {
    CRISIS_LINE_SCREEN: '~Veterans-Crisis-Line-page',
    CRISIS_LINE_CALL_NUM: '~call-800-273-8255-and-select-1',
    CRISIS_LINE_TEXT_NUM: '~text-838255',
    CRISIS_LINE_START_CHAT: '~start-a-confidential-chat',
    CRISIS_LINE_TTY: '~800-799-4889',
    CRISIS_LINE_SITE: '~Veterans Crisis Line .net'
}

class VeteransCrisisLineScreen extends AppScreen {
    constructor() {
        super(SELECTORS.CRISIS_LINE_SCREEN)
    }

    get crisisLineCallNum() {
        return $(SELECTORS.CRISIS_LINE_CALL_NUM)
    }

    get crisisLineTextNum() {
        return $(SELECTORS.CRISIS_LINE_TEXT_NUM)
    }

    get crisisLineStartChat() {
        return $(SELECTORS.CRISIS_LINE_START_CHAT)
    }

    get crisisLineTTY() {
        return $(SELECTORS.CRISIS_LINE_TTY)
    }

    get crisisLineSite() {
        return $(SELECTORS.CRISIS_LINE_SITE)
    }
}

export default new VeteransCrisisLineScreen()
