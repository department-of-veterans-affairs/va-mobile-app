import AppScreen from './app.screen'

const SELECTORS = {
  PREPARE_FOR_VIDEO_VISIT_SCREEN: '~Prepare-for-video-visit-screen',
};

class PrepareForVideoVisitScreen extends AppScreen {
  constructor() {
    super(SELECTORS.PREPARE_FOR_VIDEO_VISIT_SCREEN)
  }
}

export default new PrepareForVideoVisitScreen()
