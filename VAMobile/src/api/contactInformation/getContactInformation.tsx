import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { has } from 'underscore'

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
  const response = await get<ContactInformationPayload>(
    '/v0/user/contact-info',
    undefined,
    contactInformationKeys.contactInformation,
    queryClient,
  )
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
