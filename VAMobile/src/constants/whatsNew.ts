import { UserAuthorizedServicesData } from 'api/types'
import { FeatureToggleType } from 'utils/remoteConfig'

/**
 * Controls what will display on What's New alerts. Can be tied to a feature flag
 * that will cause the message not to be shown until the flag is activated.
 *
 * Each object in the array represents a feature. The format is:
 *
 * featureName: name that will be used as the key for the feature including
 * in translation keys
 * featureFlag: optional feature flag the feature is tied to. This will determine
 * if it's shown or not
 * authorizedService: optional authorizedService the feature is tied to. This will
 * determine if it's shown or not
 *
 */

/**
 * Example Config
 * [
 *   \{
 *     featureName: 'testFeature',
 *     featureFlag: 'remoteConfigRefreshTest',
 *   \},
 *   \{
 *     featureName: 'testFeatureNoFlag',
 *   \},
 *   \{
 *     featureName: 'testFeatureAuthService',
 *     authorizedService: 'claims'
 *   \},
 * ]
 */

export type WhatsNewConfigItem = {
  // Name of the feature being described
  featureName: string
  // If controlled by a feature flag, will not show to the user unless they have the flag enabled
  featureFlag?: FeatureToggleType
  // If controlled by an authorized service, will not show to the user unless authorized
  authorizedService?: keyof UserAuthorizedServicesData
}

export const WhatsNewConfig: WhatsNewConfigItem[] = [
  {
    featureName: 'COE',
    featureFlag: 'COEAvailable',
  },
  {
    featureName: 'TravelListAndStatus',
    featureFlag: 'travelPayStatusList'
  },
]

export const getWhatsNewConfig = (): WhatsNewConfigItem[] => {
  return WhatsNewConfig
}
