import * as RNLocalize from 'react-native-localize'
import * as combinedEn from 'translations/en/combinedEn.json'
import * as combinedEs from 'translations/es/CombinedEs.json'
import { Functions } from 'translations/newFunctions'

const fallbackLanguage = { languageTag: 'en', isRTL: false }
const defaultLanguage = RNLocalize.findBestAvailableLanguage(['en', 'es']) || fallbackLanguage
export const languageTag = defaultLanguage.languageTag

export const resources = {
  en: combinedEn,
  es: combinedEs,
}

export const Language = {
  strings: languageTag === 'en' ? resources.en : resources.es,
  functions: Functions,
}
