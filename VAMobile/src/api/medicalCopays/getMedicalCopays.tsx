import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { medicalCopayKeys } from 'api/medicalCopays/queryKeys'
import { MedicalCopaysPayload } from 'api/types'
import { ACTIVITY_STALE_TIME } from 'constants/common'
import { get } from 'store/api'

type CopaySummary = { amountDue: number; count: number }

/**
 * Compute the copay summary from the payload
 */
const summarize = (payload?: MedicalCopaysPayload): CopaySummary => {
  const items = payload?.data ?? []
  const amountDue = items.reduce((sum, s) => sum + (s.pHAmtDue ?? 0), 0)
  const count = items.filter((s) => (s.pHAmtDue ?? 0) > 0).length
  return { amountDue, count }
}

/**
 * Fetch all medical copay balances for the current user
 */
export const getMedicalCopays = async (): Promise<MedicalCopaysPayload | undefined> => {
  const res = await get<MedicalCopaysPayload>(`/v0/medical_copays`)
  if (res) return res
}

export const useMedicalCopays = (options?: { enabled?: boolean }) => {
  const query = useQuery({
    ...options,
    queryKey: medicalCopayKeys.medicalCopays,
    queryFn: getMedicalCopays,
    staleTime: ACTIVITY_STALE_TIME,
    meta: {
      errorName: 'getMedicalCopays: Service error',
    },
  })

  const summary = useMemo(() => summarize(query.data), [query.data])
  return { ...query, summary }
}
