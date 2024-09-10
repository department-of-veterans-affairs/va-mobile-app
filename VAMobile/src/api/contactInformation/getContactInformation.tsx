import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { has } from 'underscore'

import { errorKeys } from 'api/errors'
import { ErrorData } from 'api/types'
import { ContactInformationPayload, UserContactInformation } from 'api/types/ContactInformation'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { getFormattedPhoneNumber } from 'utils/common'
import { useDowntime } from 'utils/hooks'

import { contactInformationKeys } from './queryKeys'

/**
 * Fetch user contact information
 */
const getContactInformation = async (queryClient: QueryClient): Promise<UserContactInformation | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === contactInformationKeys.contactInformation[0]) {
        throw error.error
      }
    })
  }

  const response = await get<ContactInformationPayload>('/v0/user/contact-info')
  const contactInformation = response?.data.attributes

  if (contactInformation) {
    return {
      ...contactInformation,
      formattedHomePhone: contactInformation.homePhone && getFormattedPhoneNumber(contactInformation.homePhone),
      formattedMobilePhone: contactInformation.mobilePhone && getFormattedPhoneNumber(contactInformation.mobilePhone),
      formattedWorkPhone: contactInformation.workPhone && getFormattedPhoneNumber(contactInformation.workPhone),
    }
  }
}

/**
 * Returns a query for user contact information
 */
export const useContactInformation = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()
  const profileUpdateInDowntime = useDowntime(DowntimeFeatureTypeConstants.userProfileUpdate)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: !!(!profileUpdateInDowntime && queryEnabled),
    queryKey: contactInformationKeys.contactInformation,
    queryFn: () => getContactInformation(queryClient),
    meta: {
      errorName: 'getContactInfo: Service error',
    },
    retry: 1,
  })
}
