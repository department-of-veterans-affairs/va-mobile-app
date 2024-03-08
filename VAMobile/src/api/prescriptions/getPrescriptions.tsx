import { useQuery } from '@tanstack/react-query'
import { TFunction } from 'i18next'
import { contains, filter, sortBy } from 'underscore'

import {
  PrescriptionSortOptionConstants,
  PrescriptionsGetData,
  PrescriptionsList,
  RefillStatus,
  RefillStatusConstants,
} from 'api/types'
import { get } from 'store/api'
import { getTextForRefillStatus } from 'utils/prescriptions'

import { prescriptionKeys } from './queryKeys'

/**
 * Fetch user prescriptions
 */
const getPrescriptions = (): Promise<PrescriptionsGetData | undefined> => {
  const params = {
    'page[number]': '1',
    'page[size]': '5000',
    sort: 'refill_status', // Parameters are snake case for the back end
  }
  return get<PrescriptionsGetData>('/v0/health/rx/prescriptions', params)
}

/**
 * Returns a query for user prescriptions
 */
export const usePrescriptions = (options?: { enabled?: boolean }) => {
  return useQuery({
    ...options,
    queryKey: prescriptionKeys.prescriptions,
    queryFn: () => getPrescriptions(),
    meta: {
      errorName: 'getPrescriptions: Service error',
    },
  })
}

export const filterAndSortPrescriptions = (
  prescrptions: PrescriptionsList,
  filters: string[],
  sort: string,
  ascending: boolean,
  t: TFunction,
): PrescriptionsList => {
  let filteredList: PrescriptionsList = []
  // If there are no filters, don't filter the list
  if (filters[0] === '') {
    filteredList = [...prescrptions]
  } else if (filters[0] === RefillStatusConstants.PENDING) {
    filteredList = filter(prescrptions, (prescription) => {
      return (
        prescription.attributes.refillStatus === RefillStatusConstants.REFILL_IN_PROCESS ||
        prescription.attributes.refillStatus === RefillStatusConstants.SUBMITTED
      )
    })
  } else if (filters[0] === RefillStatusConstants.TRACKING) {
    filteredList = filter(prescrptions, (prescription) => {
      return prescription.attributes.isTrackable
    })
  } else {
    // Apply the custom filter by
    filteredList = filter(prescrptions, (prescription) => {
      return contains(filters, prescription.attributes.refillStatus)
    })
  }

  let sortedList: PrescriptionsList = []

  // Sort the list
  switch (sort) {
    case PrescriptionSortOptionConstants.PRESCRIPTION_NAME:
    case PrescriptionSortOptionConstants.REFILL_REMAINING:
      sortedList = sortBy(filteredList, (a) => {
        return a.attributes[sort]
      })
      break
    case PrescriptionSortOptionConstants.REFILL_DATE:
      sortedList = sortBy(filteredList, (a) => {
        return new Date(a.attributes.refillDate || 0)
      })
      break
    case PrescriptionSortOptionConstants.REFILL_STATUS:
      sortedList = sortBy(filteredList, (a) => {
        return getTextForRefillStatus(a.attributes[sort] as RefillStatus, t)
      })
      break
  }

  // For descending order, reverse the list
  if (!ascending) {
    sortedList.reverse()
  }

  return sortedList
}
