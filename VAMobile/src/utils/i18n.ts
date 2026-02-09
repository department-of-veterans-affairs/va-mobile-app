import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'

import AsyncStorage from '@react-native-async-storage/async-storage'

import i18n from 'i18next'

import { NAMESPACE } from 'constants/namespaces'
import * as commonEN from 'translations/en/common.json'
import * as commonES from 'translations/es/common.json'

const fallbackLanguage = { languageTag: 'en', isRTL: false }
const defaultLanguage = RNLocalize.findBestLanguageTag(['en']) || fallbackLanguage
export const LANGUAGE_PREF = '@language_pref'

export const resources = {
  en: {
    common: commonEN,
  },
  es: {
    common: commonES,
  },
} as const

export const defaultNS = NAMESPACE.COMMON

export const geti18n = async () => {
  const prefKey = await AsyncStorage.getItem(LANGUAGE_PREF)
  const prefLanguage = prefKey || defaultLanguage.languageTag
  console.log('pref key is ' + prefKey)
  console.log('setting language to ' + prefLanguage)

  // Initialize the internationalization library
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: prefLanguage,
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

  return i18n
}

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
