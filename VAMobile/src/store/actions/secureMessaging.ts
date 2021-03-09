import { AsyncReduxAction, ReduxAction } from 'store/types'
import { ScreenIDTypes, SecureMessagesList, SecureMessagesListData } from 'store/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'

const dispatchStartPrefetchInboxMessages = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_PREFETCH_INBOX_MESSAGES',
    payload: {},
  }
}

const dispatchFinishPrefetchInboxMessages = (inboxMessages?: SecureMessagesListData, error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_PREFETCH_INBOX_MESSAGES',
    payload: {
      inboxMessages,
      error,
    },
  }
}

/**
 * Redux action to prefetch inbox messages
 * TODO should this just be a generic prefetchMessages?
 */
export const prefetchInboxMessages = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(prefetchInboxMessages(screenID))))
    dispatch(dispatchStartPrefetchInboxMessages())

    try {
      // TODO: change to non-hard-coded
      //inboxMessages = await api.get<AppointmentsGetData>('/v0/messaging/health/folders/0/messages')
      const inboxMessages = {
        data: [
          {
            type: 'messages',
            id: '123456',
            attributes: {
              messageId: 123456,
              category: 'GENERAL',
              subject: 'Hardcoded message',
              body: undefined,
              attachment: false,
              sentDate: '2021-ish',
              senderId: 8888888,
              senderName: 'Dr Octopus',
              recipientId: 9999999,
              recipientName: 'Peter Parker',
              readReceipt: undefined,
            },
          },
        ],
      }

      dispatch(dispatchFinishPrefetchInboxMessages(inboxMessages, undefined))
    } catch (error) {
      dispatch(dispatchFinishPrefetchInboxMessages(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

//TODO all of these
//export const getFolders
//export const getMessagesInFolder (folderId)
//export const getMessage (messageId)
//export const getRecipients (prefetch?)
//

/**
 * Redux action to get all appointments in the given date range
 */
// export const getAppointmentsInDateRange = (startDate: string, endDate: string, timeFrame: TimeFrameType, screenID?: ScreenIDTypes): AsyncReduxAction => {
//   return async (dispatch, _getState): Promise<void> => {
//     dispatch(dispatchClearErrors())
//     dispatch(dispatchSetTryAgainFunction(() => dispatch(getAppointmentsInDateRange(startDate, endDate, timeFrame, screenID))))
//     dispatch(dispatchStartGetAppointmentsInDateRange())

//     try {
//       const appointmentsList = await api.get<AppointmentsGetData>('/v0/appointments', { startDate, endDate } as Params)
//       dispatch(dispatchFinishGetAppointmentsInDateRange(appointmentsList?.data || [], appointmentsList?.meta?.errors, timeFrame))
//     } catch (error) {
//       dispatch(dispatchFinishGetAppointmentsInDateRange(undefined, undefined, undefined, error))
//       dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
//     }
//   }
// }

// const dispatchGetAppointment = (appointmentID: string): ReduxAction => {
//   return {
//     type: 'APPOINTMENTS_GET_APPOINTMENT',
//     payload: {
//       appointmentID,
//     },
//   }
// }

// /**
//  * Redux action to get a single appointment
//  */
// export const getAppointment = (appointmentID: string): AsyncReduxAction => {
//   return async (dispatch, _getState): Promise<void> => {
//     dispatch(dispatchGetAppointment(appointmentID))
//   }
// }
