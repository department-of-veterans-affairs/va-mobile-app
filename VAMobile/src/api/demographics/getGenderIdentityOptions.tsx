import { useQuery } from '@tanstack/react-query'
import { has } from 'underscore'

import { GenderIdentityOptions, GenderIdentityOptionsPayload } from 'api/types/DemographicsData'
import { UserAnalytics } from 'constants/analytics'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'

import { demographicsKeys } from './queryKeys'

/**
 * Fetch gender identity options
 */
const getGenderIdentityOptions = async (): Promise<GenderIdentityOptions> => {
  const response = await get<GenderIdentityOptionsPayload>(
    '/v0/user/gender_identity/edit',
    undefined,
    demographicsKeys.genderIdentityOptions,
  )
  const responseOptions = response?.data.attributes.options || {}

  // TODO: Look into adding an option to the API function for disabling the X-Key-Inflection property.
  // Right now it's set to 'camel' which returns the keys in lowercase. We need to capitalize the keys
  // so that they're consistent with what the PUT request for updating the genderIdentity field expects.
  return Object.keys(responseOptions).reduce((options: GenderIdentityOptions, key: string) => {
    options[key.toUpperCase()] = responseOptions[key]
    return options
  }, {})
}

/**
 * Returns a query for gender identity options
 */
export const useGenderIdentityOptions = (options?: { enabled?: boolean }) => {
  const profileUpdateInDowntime = useDowntime(DowntimeFeatureTypeConstants.userProfileUpdate)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: !!(!profileUpdateInDowntime && queryEnabled),
    queryKey: demographicsKeys.genderIdentityOptions,
    queryFn: () => getGenderIdentityOptions(),
    meta: {
      analyticsUserProperty: UserAnalytics.vama_uses_profile(),
      errorName: 'getGenderIdentityOptions: Service error',
    },
  })
}
