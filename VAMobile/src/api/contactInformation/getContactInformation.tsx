import { useQuery } from '@tanstack/react-query'

import { ContactInformationPayload, UserContactInformation } from 'api/types/ContactInformation'
import { contactInformationKeys } from './queryKeys'
import { get } from 'store/api'
import { getFormattedPhoneNumber } from 'utils/common'

/**
 * Fetch user contact information
 */
export const getContactInformation = async (): Promise<UserContactInformation | undefined> => {
  try {
    const response = await get<ContactInformationPayload>('/v0/user/contact-info')
    const contactInformation = response?.data.attributes

    if (contactInformation) {
      return {
        ...contactInformation,
        formattedHomePhone: contactInformation.homePhoneNumber && getFormattedPhoneNumber(contactInformation.homePhoneNumber),
        formattedMobilePhone: contactInformation.mobilePhoneNumber && getFormattedPhoneNumber(contactInformation.mobilePhoneNumber),
        formattedWorkPhone: contactInformation.workPhoneNumber && getFormattedPhoneNumber(contactInformation.workPhoneNumber),
      }
    }
    return contactInformation
  } catch (error) {
    throw error
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
