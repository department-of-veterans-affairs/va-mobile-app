import { useQuery } from '@tanstack/react-query'

import { PersonalInformationData, PersonalInformationPayload } from 'api/types'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { get } from 'store/api'
import { getAllFieldsThatExist } from 'utils/common'
import { personalInformationKeys } from './queryKeys'

/**
 * Fetch user personal information
 */
export const getPersonalInformation = async (): Promise<PersonalInformationData | undefined> => {
  const response = await get<PersonalInformationPayload>('/v2/user')
  const personalInformation = response?.data.attributes

  if (personalInformation) {
    const birthDay = personalInformation.birthDate
    return {
      ...personalInformation,
      fullName: getAllFieldsThatExist([personalInformation.firstName, personalInformation?.middleName || '', personalInformation.lastName])
        .join(' ')
        .trim(),
      birthDate: birthDay && formatDateMMMMDDYYYY(birthDay),
    }
  }
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
