import { useQuery } from '@tanstack/react-query'
import _ from 'underscore'

import { LettersData, LettersList } from 'api/types'
import { get } from 'store/api'

import { lettersKeys } from './queryKeys'

const sortByName = (letters?: LettersList): LettersList => {
  const newLetters = letters || []
  return _.sortBy(newLetters, (letter) => {
    return letter.name
  })
}

/**
 * Fetch user letters
 */
const getLetters = async (): Promise<LettersList | undefined> => {
  const response = await get<LettersData>('/v0/letters')
  if (response) {
    return sortByName(response.data.attributes.letters)
  }
}

/**
 * Returns a query for user letters
 */
export const useLetters = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: lettersKeys.letters,
    queryFn: () => getLetters(),
    meta: {
      errorName: 'getLetters: Service error',
    },
  })
}
