import { useQuery } from '@tanstack/react-query'

import { GenderIdentityOptions, GenderIdentityOptionsPayload } from 'api/types/DemographicsData'
import { UserAnalytics } from 'constants/analytics'
import { get } from 'store/api'

/**
 * Fetch gender identity options
 */
export const getGenderIdentityOptions = async (): Promise<GenderIdentityOptions> => {
  try {
    const response = await get<GenderIdentityOptionsPayload>('/v0/user/gender_identity/edit')
    const responseOptions = response?.data.attributes.options || {}

    // TODO: Look into adding an option to the API function for disabling the X-Key-Inflection property.
    // Right now it's set to 'camel' which returns the keys in lowercase. We need to capitalize the keys
    // so that they're consistent with what the PUT request for updating the genderIdentity field expects.
    return Object.keys(responseOptions).reduce((options: GenderIdentityOptions, key: string) => {
      options[key.toUpperCase()] = responseOptions[key]
      return options
    }, {})
  } catch (error) {
    throw error
  }
}

/**
 * Returns a query for gender identity options
 */
export const useGenderIdentityOptions = () => {
  return useQuery({
    queryKey: ['user', 'gender_identity', 'options'],
    queryFn: () => getGenderIdentityOptions(),
    initialData: {},
    meta: {
      analyticsUserProperty: UserAnalytics.vama_uses_profile(),
      errorName: 'getGenderIdentityOptions: Service error',
    },
  })
}
