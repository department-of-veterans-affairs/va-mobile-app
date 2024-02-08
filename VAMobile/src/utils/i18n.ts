import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'

import i18n from 'i18next'

import { NAMESPACE } from 'constants/namespaces'
import * as commonEN from 'translations/en/common.json'

const fallbackLanguage = { languageTag: 'en', isRTL: false }
const defaultLanguage = RNLocalize.findBestLanguageTag(['en']) || fallbackLanguage

export const resources = {
  en: {
    common: commonEN,
  },
} as const

export const defaultNS = NAMESPACE.COMMON

// Initialize the internationalization library
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: defaultLanguage.languageTag,
  resources,
  defaultNS,
  nsSeparator: ':',
  keySeparator: false,
  fallbackLng: 'en',
  debug: true,
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },
  react: {
    useSuspense: true,
  },
})

export default i18n
