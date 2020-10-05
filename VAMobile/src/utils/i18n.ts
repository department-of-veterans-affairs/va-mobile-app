import * as en from 'translations/en.json'

import * as RNLocalize from 'react-native-localize'
import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'

const fallbackLanguage = { languageTag: 'en', isRTL: false }
const defaultLanguage = RNLocalize.findBestAvailableLanguage(['en']) || fallbackLanguage

// Initialize the internationalization library
i18n.use(initReactI18next).init({
	lng: defaultLanguage.languageTag,
	resources: {
		en: { translation: en },
	},
	nsSeparator: false,
	keySeparator: false,
	fallbackLng: false,
	debug: true,
	interpolation: {
		escapeValue: false,
		formatSeparator: ',',
	},
	react: {
		wait: true,
	},
})

export default i18n
