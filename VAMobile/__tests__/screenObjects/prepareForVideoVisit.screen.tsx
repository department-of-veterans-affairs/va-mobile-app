import AppScreen from './app.screen'

const SELECTORS = {
  PREPARE_FOR_VIDEO_VISIT_SCREEN: '~prepare-for-video-visit-page',
};

class PrepareForVideoVisitScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PREPARE_FOR_VIDEO_VISIT_SCREEN)
  }
}

export default new PrepareForVideoVisitScreen()
