import {
  AppointmentsGetData,
  ClaimsAndAppealsGetDataMetaError,
  ClaimsAndAppealsListPayload,
  PrescriptionsGetData,
  SecureMessagingFoldersGetData,
} from 'api/types'
import { DEFAULT_UPCOMING_DAYS_LIMIT } from 'constants/appointments'

export const getAppointmentsPayload = (upcomingAppointmentsCount: number): AppointmentsGetData => ({
  data: [],
  meta: {
    upcomingAppointmentsCount,
    upcomingDaysLimit: DEFAULT_UPCOMING_DAYS_LIMIT,
  },
})
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

export const getFoldersPayload = (inboxUnreadCount: number): SecureMessagingFoldersGetData => ({
  data: [
    {
      id: '0',
      type: 'folders',
      attributes: {
        folderId: 0,
        name: 'Inbox',
        count: 12,
        unreadCount: inboxUnreadCount,
        systemFolder: true,
      },
    },
  ],
  links: {
    self: '',
    first: '',
    prev: '',
    next: '',
    last: '',
  },
  inboxUnreadCount,
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalEntries: 3,
    },
  },
})

export const getPrescriptionsPayload = (refillablePrescriptionsCount: number): PrescriptionsGetData => ({
  data: [],
  links: {
    self: '',
    first: '',
    prev: null,
    next: null,
    last: '',
  },
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalEntries: 3,
    },
    prescriptionStatusCount: {
      active: 6,
      isRefillable: refillablePrescriptionsCount,
      discontinued: 10,
      expired: 80,
      historical: 0,
      pending: 1,
      transferred: 3,
      submitted: 0,
      hold: 0,
      unknown: 0,
      total: 20,
    },
  },
})
