import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { sortBy } from 'underscore'

import { errorKeys } from 'api/errors'
import { ErrorData, LettersData, LettersList } from 'api/types'
import { get } from 'store/api'

import { lettersKeys } from './queryKeys'

const sortByName = (letters?: LettersList): LettersList => {
  const newLetters = letters || []
  return sortBy(newLetters, (letter) => {
    return letter.name
  })
}

/**
 * Fetch user letters
 */
const getLetters = async (queryClient: QueryClient): Promise<LettersList | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === lettersKeys.letters[0]) {
        throw error.error
      }
    })
  }
  const response = await get<LettersData>('/v0/letters')
  if (response) {
    return sortByName(response.data.attributes.letters)
  }
}

/**
 * Returns a query for user letters
 */
export const useLetters = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()

  return useQuery({
    ...options,
    queryKey: lettersKeys.letters,
    queryFn: () => getLetters(queryClient),
    meta: {
      errorName: 'getLetters: Service error',
    },
  })
}
