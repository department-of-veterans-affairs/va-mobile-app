/**
 * Controls what will display on What's New alerts. Can be tied to a feature flag
 * that will cause the message not to be shown until the flag is activated.
 *
 * Each object in the array represents a feature. The format is:
 *
 * featureName: name that will be used as the key for the feature including
 * in translation keys
 * featureFlag: the flag the feature is tied to. This will determine if it's shown or not
 *
 */

export const WhatsNewConfig = [
  {
    featureName: 'testFeature',
    featureFlag: 'remoteConfigRefreshTest',
  },
  {
    featureName: 'testFeatureNoFlag',
  },
]
