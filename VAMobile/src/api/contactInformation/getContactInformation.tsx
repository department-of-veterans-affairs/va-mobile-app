import { useQuery } from '@tanstack/react-query'

import { ContactInformationPayload, UserContactInformation } from 'api/types/ContactInformation'
import { contactInformationKeys } from './queryKeys'
import { get } from 'store/api'
import { getFormattedPhoneNumber } from 'utils/common'

/**
 * Fetch user contact information
 */
const getContactInformation = async (): Promise<UserContactInformation | undefined> => {
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
export const useContactInformation = () => {
  return useQuery({
    queryKey: contactInformationKeys.contactInformation,
    queryFn: () => getContactInformation(),
    meta: {
      errorName: 'getContactInfo: Service error',
    },
  })
}
