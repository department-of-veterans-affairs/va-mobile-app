import { DateTime, Interval } from 'luxon'

import {
  AppointmentData,
  AppointmentsGetData,
  AvsBinariesGetData,
  SummaryBinary,
  SummaryBinaryGetData,
  SummaryMetadata,
} from 'api/types'
import { Params } from 'store/api/api'
import { data as avsBinariesMockData } from 'store/api/demo/mocks/default/avsBinaries'
import { DemoStore } from 'store/api/demo/store'

/**
 * Type denoting the demo data store
 */
export type AppointmentsDemoStore = {
  '/v0/appointments': {
    past: AppointmentsGetData
    upcoming: AppointmentsGetData
  }
}

export type AppointmentDemoReturnTypes = undefined | AppointmentsGetData | AvsBinariesGetData

/**
 * Function used to get user appointments
 * @param params- PUT/POST params that will be used to update the demo store.
 */
export const getAppointments = (store: DemoStore, params: Params): AppointmentsGetData | undefined => {
  const endDate = params.endDate
  const startDate = params.startDate as string
  const sortDirection = params.sort

  if (endDate && typeof endDate === 'string' && sortDirection && typeof sortDirection === 'string') {
    // Changed from prior check because now past 3 months goes until current end of day
    if (sortDirection.startsWith('-')) {
      // Filter data from json file with dates in specified time range
      const pastAppts = JSON.parse(JSON.stringify(store['/v0/appointments'].past))
      const interval = Interval.fromDateTimes(new Date(startDate), new Date(endDate))
      const filteredApptsData = pastAppts.data.filter((appt: AppointmentData) => {
        const apptDate = DateTime.fromISO(appt.attributes.startDateLocal)
        return interval.contains(apptDate)
      })
      pastAppts.data = [...filteredApptsData]
      pastAppts.meta.pagination.totalEntries = filteredApptsData.length
      return pastAppts
    } else {
      return store['/v0/appointments'].upcoming
    }
  } else {
    return undefined
  }
}

/**
 * Function used to get AVS binary data for an appointment from demo store metadata
 * @param params - GET params, expects optional docIds comma-separated list
 * @param endpoint - API endpoint containing appointment id in /v0/appointments/avs_binaries/:id
 */
export const getAvsBinaries = (_store: DemoStore, params: Params, endpoint: string): AvsBinariesGetData | undefined => {
  const appointmentId = endpoint.match(/^\/v0\/appointments\/avs_binaries\/([^/]+)\/?$/)?.[1]
  if (!appointmentId) {
    return undefined
  }

  const docIdsParam = params.docIds
  const docIds = typeof docIdsParam === 'string' && docIdsParam.length > 0 ? docIdsParam.split(',') : undefined

  const binariesForAppointment = avsBinariesMockData[appointmentId as keyof typeof avsBinariesMockData]
  if (!binariesForAppointment?.length) {
    return { data: [] }
  }

  const filteredByDocIds = docIds?.length
    ? binariesForAppointment.filter((summary) => docIds.includes(summary.docId))
    : binariesForAppointment

  return {
    data: filteredByDocIds.map((summary: SummaryBinaryGetData) => ({
      id: summary.docId,
      type: 'avs_binary',
      attributes: {
        docId: summary.docId,
        binary: summary.binary ?? null,
        error: summary.error ?? null,
      },
    })),
  }
}
