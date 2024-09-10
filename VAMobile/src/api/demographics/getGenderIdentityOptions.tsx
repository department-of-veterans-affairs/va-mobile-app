import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { has } from 'underscore'

import { errorKeys } from 'api/errors'
import { ErrorData } from 'api/types'
import { GenderIdentityOptions, GenderIdentityOptionsPayload } from 'api/types/DemographicsData'
import { UserAnalytics } from 'constants/analytics'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { useDowntime } from 'utils/hooks'

import { demographicsKeys } from './queryKeys'

/**
 * Fetch gender identity options
 */
const getGenderIdentityOptions = async (queryClient: QueryClient): Promise<GenderIdentityOptions> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === demographicsKeys.genderIdentityOptions[0]) {
        throw error.error
      }
    })
  }
  const response = await get<GenderIdentityOptionsPayload>('/v0/user/gender_identity/edit')
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
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    enabled: !!(!profileUpdateInDowntime && queryEnabled),
    queryKey: demographicsKeys.genderIdentityOptions,
    queryFn: () => getGenderIdentityOptions(queryClient),
    meta: {
      analyticsUserProperty: UserAnalytics.vama_uses_profile(),
      errorName: 'getGenderIdentityOptions: Service error',
    },
  })
}
