import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import * as api from '../api'
import { AppThunk } from 'store'
import { PrescriptionsGetData, PrescriptionsList, PrescriptionsMap, ScreenIDTypes } from '../api'
import { dispatchClearErrors } from './errorSlice'
import { indexBy } from 'underscore'

export type PrescriptionState = {
  loading: boolean
  prescriptions?: PrescriptionsList
  error?: api.APIError
  prescriptionsById: PrescriptionsMap
}

export const initialPrescriptionState: PrescriptionState = {
  loading: false,
  prescriptionsById: {} as PrescriptionsMap,
}

export const getPrescriptions =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchStartGetPrescriptions())

    const prescriptionData: PrescriptionsGetData = {
      data: [
        {
          type: 'Prescription',
          id: '13650544',
          attributes: {
            refillStatus: 'refillinprocess',
            refillSubmitDate: '2022-10-28T04:00:00.000Z',
            refillDate: '2022-10-28T04:00:00.000Z',
            refillRemaining: 5,
            facilityName: 'DAYT29',
            isRefillable: false,
            isTrackable: false,
            orderedDate: '2022-10-28T04:00:00.000Z',
            quantity: 10,
            expirationDate: '2022-10-28T04:00:00.000Z',
            prescriptionNumber: '2719536',
            prescriptionName: 'SOMATROPIN 5MG INJ (VI)',
            instructions: 'TAKE 1 TABLET WITH FOOD 3 TIMES A DAY',
            dispensedDate: '2022-10-28T04:00:00.000Z',
            stationNumber: '989',
          },
        },
        {
          type: 'Prescription',
          id: '13650545',
          attributes: {
            refillStatus: 'active',
            refillSubmitDate: '2022-10-28T04:00:00.000Z',
            refillDate: '2022-10-28T04:00:00.000Z',
            refillRemaining: 5,
            facilityName: 'DAYT29',
            isRefillable: false,
            isTrackable: false,
            orderedDate: '2022-10-28T04:00:00.000Z',
            quantity: 10,
            expirationDate: '2022-10-28T04:00:00.000Z',
            prescriptionNumber: '2719536',
            prescriptionName: 'SOMATROPIN 5MG INJ (VI)',
            instructions: 'TAKE 1 TABLET WITH FOOD 3 TIMES A DAY',
            dispensedDate: '2022-10-28T04:00:00.000Z',
            stationNumber: '989',
          },
        },
        {
          type: 'Prescription',
          id: '13650546',
          attributes: {
            refillStatus: 'discontinued',
            refillSubmitDate: '2022-10-28T04:00:00.000Z',
            refillDate: '2022-10-28T04:00:00.000Z',
            refillRemaining: 5,
            facilityName: 'DAYT29',
            isRefillable: false,
            isTrackable: false,
            orderedDate: '2022-10-28T04:00:00.000Z',
            quantity: 10,
            expirationDate: '2022-10-28T04:00:00.000Z',
            prescriptionNumber: '2719536',
            prescriptionName: 'SOMATROPIN 5MG INJ (VI)',
            instructions: 'TAKE 1 TABLET WITH FOOD 3 TIMES A DAY',
            dispensedDate: '2022-10-28T04:00:00.000Z',
            stationNumber: '989',
          },
        },
        {
          type: 'Prescription',
          id: '13650547',
          attributes: {
            refillStatus: 'expired',
            refillSubmitDate: '2022-10-28T04:00:00.000Z',
            refillDate: '2022-10-28T04:00:00.000Z',
            refillRemaining: 5,
            facilityName: 'DAYT29',
            isRefillable: false,
            isTrackable: false,
            orderedDate: '2022-10-28T04:00:00.000Z',
            quantity: 10,
            expirationDate: '2022-10-28T04:00:00.000Z',
            prescriptionNumber: '2719536',
            prescriptionName: 'SOMATROPIN 5MG INJ (VI)',
            instructions: 'INJECT 1MG INTO THE MUSCLE WEEKLY FOR 30 DAYS',
            dispensedDate: '2022-10-28T04:00:00.000Z',
            stationNumber: '989',
          },
        },
        {
          type: 'Prescription',
          id: '13650548',
          attributes: {
            refillStatus: 'hold',
            refillSubmitDate: '2022-10-28T04:00:00.000Z',
            refillDate: '2022-10-28T04:00:00.000Z',
            refillRemaining: 5,
            facilityName: 'DAYT29',
            isRefillable: false,
            isTrackable: false,
            orderedDate: '2022-10-28T04:00:00.000Z',
            quantity: 10,
            expirationDate: '2022-10-28T04:00:00.000Z',
            prescriptionNumber: '2719536',
            prescriptionName: 'SOMATROPIN 5MG INJ (VI)',
            instructions: 'TAKE 1 TABLET WITH FOOD 3 TIMES A DAY',
            dispensedDate: '2022-10-28T04:00:00.000Z',
            stationNumber: '989',
          },
        },
        {
          type: 'Prescription',
          id: '13650549',
          attributes: {
            refillStatus: 'activeParked',
            refillSubmitDate: '2022-10-28T04:00:00.000Z',
            refillDate: '2022-10-28T04:00:00.000Z',
            refillRemaining: 5,
            facilityName: 'DAYT29',
            isRefillable: false,
            isTrackable: false,
            orderedDate: '2022-10-28T04:00:00.000Z',
            quantity: 10,
            expirationDate: '2022-10-28T04:00:00.000Z',
            prescriptionNumber: '2719536',
            prescriptionName: 'SOMATROPIN 5MG INJ (VI)',
            instructions: 'TAKE 1 TABLET WITH FOOD 3 TIMES A DAY',
            dispensedDate: '2022-10-28T04:00:00.000Z',
            stationNumber: '989',
          },
        },
        {
          type: 'Prescription',
          id: '13650550',
          attributes: {
            refillStatus: 'unknown',
            refillSubmitDate: '2022-10-28T04:00:00.000Z',
            refillDate: '2022-10-28T04:00:00.000Z',
            refillRemaining: 5,
            facilityName: 'DAYT29',
            isRefillable: false,
            isTrackable: false,
            orderedDate: '2022-10-28T04:00:00.000Z',
            quantity: 10,
            expirationDate: '2022-10-28T04:00:00.000Z',
            prescriptionNumber: '2719536',
            prescriptionName: 'SOMATROPIN 5MG INJ (VI)',
            instructions: 'TAKE 1 TABLET WITH FOOD 3 TIMES A DAY',
            dispensedDate: '2022-10-28T04:00:00.000Z',
            stationNumber: '989',
          },
        },
      ],
    }

    setTimeout(() => {
      dispatch(dispatchFinishGetPrescriptions({ prescriptionData }))
    }, 500)
  }

const prescriptionSlice = createSlice({
  name: 'prescriptions',
  initialState: initialPrescriptionState,
  reducers: {
    dispatchStartGetPrescriptions: (state) => {
      state.loading = true
    },
    dispatchFinishGetPrescriptions: (state, action: PayloadAction<{ prescriptionData?: PrescriptionsGetData }>) => {
      const { prescriptionData } = action.payload
      const { data: prescriptions } = prescriptionData || ({} as PrescriptionsGetData)
      const prescriptionsById = indexBy(prescriptions || [], 'id')

      state.prescriptions = prescriptions
      state.loading = false
      state.prescriptionsById = prescriptionsById
    },
  },
})

export const { dispatchStartGetPrescriptions, dispatchFinishGetPrescriptions } = prescriptionSlice.actions
export default prescriptionSlice.reducer
