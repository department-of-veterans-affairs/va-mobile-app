import { useQuery } from '@tanstack/react-query'
import { has } from 'underscore'

import { PersonalInformationData, PersonalInformationPayload } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { getAllFieldsThatExist } from 'utils/common'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useDowntime } from 'utils/hooks'

import { personalInformationKeys } from './queryKeys'

/**
 * Fetch user personal information
 */
export const getPersonalInformation = async (): Promise<PersonalInformationData | undefined> => {
  const response = await get<PersonalInformationPayload>(
    '/v2/user',
    undefined,
    personalInformationKeys.personalInformation,
  )
  const personalInformation = response?.data.attributes

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
  const profileUpdateInDowntime = useDowntime(DowntimeFeatureTypeConstants.userProfileUpdate)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true

  return useQuery({
    ...options,
    enabled: !!(!profileUpdateInDowntime && queryEnabled),
    queryKey: personalInformationKeys.personalInformation,
    queryFn: () => getPersonalInformation(),
    meta: {
      errorName: 'getPersonalInformation: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
