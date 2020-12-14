import AppScreen from './app.screen';

const SELECTORS = {
  CONSOLIDATED_CLAIMS_NOTES_SCREEN: '~Consolidated-claims-note-screen',
};

class ConsolidatedClaimsNoteScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CONSOLIDATED_CLAIMS_NOTES_SCREEN)
  }
}

export default new ConsolidatedClaimsNoteScreen()
