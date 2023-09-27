import { useQuery } from '@tanstack/react-query'

import { PersonalInformationData, PersonalInformationPayload } from 'api/types/PersonalInformationData'
import { get } from 'store/api'
import { personalInformationKeys } from './queryKeys'

/**
 * Fetch user personal information
 */
export const getPersonalInformation = async (): Promise<PersonalInformationData | undefined> => {
  const response = await get<PersonalInformationPayload>('/v2/user')
  return response?.data.attributes
}

/**
 * Returns a query for user personal information
 */
export const usePersonalInformation = () => {
  return useQuery({
    queryKey: personalInformationKeys.personalInformation,
    queryFn: () => getPersonalInformation(),
    meta: {
      errorName: 'getPersonalInformation: Service error',
    },
  })
}
