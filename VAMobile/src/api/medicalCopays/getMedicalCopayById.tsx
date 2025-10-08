import { useQuery } from '@tanstack/react-query'

import { medicalCopayKeys } from 'api/medicalCopays/queryKeys'
import { MedicalCopayPayload } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'

/**
 * Fetch a single medical copay by ID
 */
export const getMedicalCopayById = async (id: string): Promise<MedicalCopayPayload | undefined> => {
  const res = await get<MedicalCopayPayload>(`/v0/medical_copays/${id}`)
  if (res) return res
}

export const useMedicalCopayById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: medicalCopayKeys.medicalCopayById,
    queryFn: () => getMedicalCopayById(id),
    meta: {
      errorName: 'getMedicalCopayById: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
