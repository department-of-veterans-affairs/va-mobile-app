import { useQuery } from '@tanstack/react-query'

import { PersonalInformationData, PersonalInformationPayload } from 'api/types'
import { UserAnalytics } from 'constants/analytics'
import { get } from 'store/api'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { getAllFieldsThatExist } from 'utils/common'
import getEnv from 'utils/env'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'

import { personalInformationKeys } from './queryKeys'

const { ENVIRONMENT } = getEnv()
/**
 * Fetch user personal information
 */
export const getPersonalInformation = async (): Promise<PersonalInformationData | undefined> => {
  const response = await get<PersonalInformationPayload>('/v2/user')
  const personalInformation = response?.data.attributes
  setAnalyticsUserProperty(UserAnalytics.vama_environment(ENVIRONMENT))

  if (personalInformation) {
    const birthDay = personalInformation.birthDate
    return {
      ...personalInformation,
      fullName: getAllFieldsThatExist([
        personalInformation.firstName,
        personalInformation?.middleName || '',
        personalInformation.lastName,
      ])
        .join(' ')
        .trim(),
      birthDate: birthDay && formatDateMMMMDDYYYY(birthDay),
      id: response.data.id,
    }
  }
}

/**
 * Returns a query for user personal information
 */
export const usePersonalInformation = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: personalInformationKeys.personalInformation,
    queryFn: () => getPersonalInformation(),
    meta: {
      errorName: 'getPersonalInformation: Service error',
    },
  })
}
