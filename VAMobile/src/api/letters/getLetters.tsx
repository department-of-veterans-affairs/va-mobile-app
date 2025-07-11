import { useQuery } from '@tanstack/react-query'

import { lettersKeys } from 'api/letters/queryKeys'
import { LettersData, LettersList } from 'api/types'
import { get } from 'store/api'

/**
 * Fetch user letters
 */
const getLetters = async (): Promise<LettersList | undefined> => {
  const response = await get<LettersData>('/v0/letters')
  if (response) {
    return response.data.attributes.letters
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
