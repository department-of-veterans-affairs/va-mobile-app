import { useQuery } from '@tanstack/react-query'

import { Gravesite } from 'api/types/GravesiteData'

import { gravesiteKeys } from './queryKeys'

/**
 * Fetch gravesites
 */
const getGravesites = (firstName: string, lastName: string): Promise<Array<Gravesite> | undefined> => {
  const url = new URL('https://www.data.va.gov/resource/3u66-fxug.json')
  if (firstName.length > 0) {
    url.searchParams.append('d_first_name', encodeURIComponent(firstName))
  }
  url.searchParams.append('d_last_name', encodeURIComponent(lastName))

  return fetch(url.toString())
    .then((response) => response.json())
    .then((json) => {
      return json.sort((a: Gravesite, b: Gravesite) => {
        const firstNameComparison = a.d_first_name.localeCompare(b.d_first_name)
        if (firstNameComparison !== 0) return firstNameComparison

        const midNameComparison = (a.d_mid_name || '').localeCompare(b.d_mid_name || '')
        if (midNameComparison !== 0) return midNameComparison

        return a.d_last_name.localeCompare(b.d_last_name)
      })
    })
    .catch((error) => {
      console.error(error)
    })
}

/**
 * Returns a query for Gravesites
 */
export const useGravesites = (firstName: string, lastName: string) => {
  return useQuery({
    enabled: false,
    queryKey: [gravesiteKeys.gravesites, firstName, lastName],
    queryFn: () => getGravesites(firstName, lastName),
    meta: {
      errorName: 'getGravesites: Service error',
    },
  })
}
