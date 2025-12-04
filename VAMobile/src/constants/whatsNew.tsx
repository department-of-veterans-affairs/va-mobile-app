/**
 * Controls what will display on What's New alerts. Can be tied to a feature flag
 * that will cause the message not to be shown until the flag is activated
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
