import AppScreen from './app.screen';

const SELECTORS = {
  CONSOLIDATED_CLAIMS_NOTES_SCREEN: '~a-note-about-consolidated-claims-page',
};

class ConsolidatedClaimsNoteScreen extends AppScreen {
  constructor() {
    super(SELECTORS.CONSOLIDATED_CLAIMS_NOTES_SCREEN)
  }
}

export default new ConsolidatedClaimsNoteScreen()
