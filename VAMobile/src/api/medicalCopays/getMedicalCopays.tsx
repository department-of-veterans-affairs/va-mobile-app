import { useQuery } from '@tanstack/react-query'

import { medicalCopayKeys } from 'api/medicalCopays/queryKeys'
import { MedicalCopaysPayload } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'

/**
 * Fetch all medical copay balances for the current user
 */
export const getMedicalCopays = async (): Promise<MedicalCopaysPayload | undefined> => {
  const res = await get<MedicalCopaysPayload>(`/v0/medical_copays`)
  if (res) return res
}

export const useMedicalCopays = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: medicalCopayKeys.medicalCopays,
    queryFn: () => getMedicalCopays(),
    meta: {
      errorName: 'getMedicalCopays: Service error',
    },
    staleTime: ACTIVITY_STALE_TIME,
  })
}
