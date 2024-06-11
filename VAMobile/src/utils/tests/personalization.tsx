import { ClaimsAndAppealsGetDataMetaError, ClaimsAndAppealsListPayload } from 'api/types'

export const getClaimsAndAppealsPayload = (
  activeClaimsCount: number,
  serviceErrors?: Array<ClaimsAndAppealsGetDataMetaError>,
): ClaimsAndAppealsListPayload => ({
  data: [],
  meta: {
    pagination: {
      currentPage: 1,
      totalEntries: 3,
      perPage: 10,
    },
    activeClaimsCount,
    errors: serviceErrors,
  },
})
