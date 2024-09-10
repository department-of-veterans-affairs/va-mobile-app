import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { has } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { errorKeys } from 'api/errors'
import { ErrorData, LetterBeneficiaryData, LetterBeneficiaryDataPayload, LetterMilitaryService } from 'api/types'
import { get } from 'store/api'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { sortByDate } from 'utils/common'
import { getSubstringBeforeChar } from 'utils/formattingUtils'
import { useDowntime } from 'utils/hooks'

import { lettersKeys } from './queryKeys'

/**
 * Fetch user letter beneficiary data
 */
const getLetterBeneficiaryData = async (queryClient: QueryClient): Promise<LetterBeneficiaryData | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === lettersKeys.beneficiaryData[0]) {
        throw error.error
      }
    })
  }
  const response = await get<LetterBeneficiaryDataPayload>('/v0/letters/beneficiary')
  if (response) {
    const attributes = response.data.attributes
    let mostRecentServices: Array<LetterMilitaryService> = [...(attributes?.militaryService || [])]
    sortByDate(mostRecentServices, 'enteredDate')
    mostRecentServices = mostRecentServices.map((periodOfService) => {
      periodOfService.enteredDate = getSubstringBeforeChar(periodOfService.enteredDate, 'T')
      periodOfService.releasedDate = getSubstringBeforeChar(periodOfService.releasedDate, 'T')
      return periodOfService
    })
    return {
      ...attributes,
      benefitInformation: {
        ...attributes.benefitInformation,
        awardEffectiveDate: getSubstringBeforeChar(attributes.benefitInformation?.awardEffectiveDate || '', 'T'),
      },
      mostRecentServices: mostRecentServices,
    }
  }
}

/**
 * Returns a query for user letter beneficiary data
 */
export const useLetterBeneficiaryData = (options?: { enabled?: boolean }) => {
  const { data: authorizedServices } = useAuthorizedServices()
  const lettersInDowntime = useDowntime(DowntimeFeatureTypeConstants.letters)
  const queryEnabled = options && has(options, 'enabled') ? options.enabled : true
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    enabled: !!(authorizedServices?.lettersAndDocuments && !lettersInDowntime && queryEnabled),
    queryKey: lettersKeys.beneficiaryData,
    queryFn: () => getLetterBeneficiaryData(queryClient),
    meta: {
      errorName: 'getLetterBeneficiaryData: Service error',
    },
  })
}
