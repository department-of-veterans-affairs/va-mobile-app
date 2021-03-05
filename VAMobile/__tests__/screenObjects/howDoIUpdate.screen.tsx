import AppScreen from './app.screen'

const SELECTORS = {
  HOW_DO_I_UPDATE_SCREEN: '~update-my-personal-information-page',
  HOW_DO_I_UPDATE_FIND_VA_LINK: '~Find your nearest V-A location',
}

class HowDoIUpdateScreen extends AppScreen {
  constructor() {
    super(SELECTORS.HOW_DO_I_UPDATE_SCREEN)
  }

  get howDoIUpdateFindVALink() {
    return $(SELECTORS.HOW_DO_I_UPDATE_FIND_VA_LINK)
  }

}

export default new HowDoIUpdateScreen();
