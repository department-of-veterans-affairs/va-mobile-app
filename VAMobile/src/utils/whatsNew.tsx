import AsyncStorage from '@react-native-async-storage/async-storage'

import { find } from 'underscore'

import { WhatsNewConfig, WhatsNewConfigItem } from 'constants/whatsNew'

export const APP_FEATURES_WHATS_NEW_SKIPPED_VAL = '@store_app_features_whats_new_skipped'

export const getWhatsNewConfig = (): WhatsNewConfigItem[] => {
  return WhatsNewConfig
}

export const getFeaturesSkipped = async () => {
  const currentSkipsStr = await AsyncStorage.getItem(APP_FEATURES_WHATS_NEW_SKIPPED_VAL)
  let featureSkips: string[] = []

  if (currentSkipsStr) {
    featureSkips = JSON.parse(currentSkipsStr)
  }

  return featureSkips
}

export const setFeaturesSkipped = async (features: string[]) => {
  if (!features.length) {
    return
  }

  let featureSkips = await getFeaturesSkipped()
  featureSkips = featureSkips.concat(features)

  const whatsNewItems = getWhatsNewConfig()
  const currentFeatureSkips: string[] = []
  featureSkips.forEach((featureSkip) => {
    // If the skipped feature does not currently belong in the what's new config than do not include it in the skip list
    if (find(whatsNewItems, (item) => item.featureName === featureSkip)) {
      currentFeatureSkips.push(featureSkip)
    }
  })

  await AsyncStorage.setItem(APP_FEATURES_WHATS_NEW_SKIPPED_VAL, JSON.stringify(currentFeatureSkips))
}
