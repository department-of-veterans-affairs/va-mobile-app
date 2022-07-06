import _ from 'underscore'
import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import { defaultPrescriptionsList as mockData } from 'utils/tests/prescription'
import { RootState } from 'store'
import {
  dispatchClearLoadingRequestRefills,
  getTrackingInfo,
  initialPrescriptionState,
  requestRefills
} from './prescriptionSlice'
import { RefillRequestSummaryItems } from '../api'

export const ActionTypes: {
  PRESCRIPTION_START_REQUEST_REFILLS: string
  PRESCRIPTION_CONTINUE_REQUEST_REFILLS: string
  PRESCRIPTION_FINISH_REQUEST_REFILLS: string
  PRESCRIPTION_CLEAR_LOADING_REQUEST_REFILLS: string
  PRESCRIPTION_START_GET_TRACKING_INFO: string
  PRESCRIPTION_FINISH_GET_TRACKING_INFO: string
} = {
  PRESCRIPTION_START_REQUEST_REFILLS: 'prescriptions/dispatchStartRequestRefills',
  PRESCRIPTION_CONTINUE_REQUEST_REFILLS: 'prescriptions/dispatchContinueRequestRefills',
  PRESCRIPTION_FINISH_REQUEST_REFILLS: 'prescriptions/dispatchFinishRequestRefills',
  PRESCRIPTION_CLEAR_LOADING_REQUEST_REFILLS: 'prescriptions/dispatchClearLoadingRequestRefills',
  PRESCRIPTION_START_GET_TRACKING_INFO: 'prescriptions/dispatchStartGetTrackingInfo',
  PRESCRIPTION_FINISH_GET_TRACKING_INFO: 'prescriptions/dispatchFinishGetTrackingInfo',
}

context('Prescription', () => {
  describe('requestRefills', () => {
    it('should update submittedRequestRefillCount for each request submitted', async () => {
      when(api.put as jest.Mock)
          .calledWith(`/v0/health/rx/prescriptions/${mockData[0].id}/refill`)
          .mockResolvedValue({})
          .calledWith(`/v0/health/rx/prescriptions/${mockData[1].id}/refill`)
          .mockResolvedValue({})

      const store = realStore()
      await store.dispatch(requestRefills(mockData))
      const actions = store.getActions()

      // Initial/start request
      const startAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_START_REQUEST_REFILLS })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.prescriptions.submittedRequestRefillCount).toEqual(1)

      // Submitting second request
      const continueAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_CONTINUE_REQUEST_REFILLS })
      expect(continueAction).toBeTruthy()
      expect(continueAction?.state.prescriptions.submittedRequestRefillCount).toEqual(2)

      // finish should stay the same
      const finishAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_FINISH_REQUEST_REFILLS })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.prescriptions.submittedRequestRefillCount).toEqual(2)
    })

    describe('if some successfully submit', () => {
      it('should set showLoadingScreenRequestRefillsRetry to true', async () => {
        when(api.put as jest.Mock)
            .calledWith(`/v0/health/rx/prescriptions/${mockData[0].id}/refill`)
            .mockResolvedValue({})
            .calledWith(`/v0/health/rx/prescriptions/${mockData[1].id}/refill`)
            .mockRejectedValue({})

        const store = realStore()
        await store.dispatch(requestRefills(mockData))
        const actions = store.getActions()

        const finishAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_FINISH_REQUEST_REFILLS })
        expect(finishAction).toBeTruthy()
        expect(finishAction?.state.prescriptions.refillRequestSummaryItems).toEqual([
          {
            data: mockData[0],
            submitted: true,
          },
          {
            data: mockData[1],
            submitted: false,
          }
        ] as RefillRequestSummaryItems)
        expect(finishAction?.state.prescriptions.needsRefillableLoaded).toBeTruthy()
      })
    })

    describe('if all failed to submit', () => {
      it('should set showLoadingScreenRequestRefillsRetry to false', async () => {
        when(api.put as jest.Mock)
            .calledWith(`/v0/health/rx/prescriptions/${mockData[0].id}/refill`)
            .mockRejectedValue({})
            .calledWith(`/v0/health/rx/prescriptions/${mockData[1].id}/refill`)
            .mockRejectedValue({})

        const store = realStore()
        await store.dispatch(requestRefills(mockData))
        const actions = store.getActions()

        const finishAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_FINISH_REQUEST_REFILLS })
        expect(finishAction).toBeTruthy()
        expect(finishAction?.state.prescriptions.refillRequestSummaryItems).toEqual([
          {
            data: mockData[0],
            submitted: false,
          },
          {
            data: mockData[1],
            submitted: false,
          }
        ] as RefillRequestSummaryItems)
        expect(finishAction?.state.prescriptions.needsRefillableLoaded).toBeFalsy()
      })
    })

    describe('on RefillScreen', () => {
      it('should continue to show loading spinner after completing', async () => {
        when(api.put as jest.Mock)
            .calledWith(`/v0/health/rx/prescriptions/${mockData[0].id}/refill`)
            .mockResolvedValue({})
            .calledWith(`/v0/health/rx/prescriptions/${mockData[1].id}/refill`)
            .mockResolvedValue({})

        const store = realStore()
        await store.dispatch(requestRefills(mockData))
        const actions = store.getActions()

        const startAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_START_REQUEST_REFILLS })
        expect(startAction).toBeTruthy()
        expect(startAction?.state.prescriptions.submittingRequestRefills).toBeTruthy()
        expect(startAction?.state.prescriptions.showLoadingScreenRequestRefills).toBeTruthy() // start spinning

        const finishAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_FINISH_REQUEST_REFILLS })
        expect(finishAction).toBeTruthy()
        expect(finishAction?.state.prescriptions.submittingRequestRefills).toBeFalsy()
        expect(finishAction?.state.prescriptions.showLoadingScreenRequestRefills).toBeTruthy() // continue to spin
      })
    })

    describe('on RefillRequestSummary', () => {
      it('should stop showing loading spinner after completing', async () => {
        when(api.put as jest.Mock)
            .calledWith(`/v0/health/rx/prescriptions/${mockData[0].id}/refill`)
            .mockResolvedValue({})
            .calledWith(`/v0/health/rx/prescriptions/${mockData[1].id}/refill`)
            .mockResolvedValue({})

        const store = realStore()
        await store.dispatch(requestRefills(mockData))
        const actions = store.getActions()

        const startAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_START_REQUEST_REFILLS })
        expect(startAction).toBeTruthy()
        expect(startAction?.state.prescriptions.submittingRequestRefills).toBeTruthy()
        expect(startAction?.state.prescriptions.showLoadingScreenRequestRefillsRetry).toBeTruthy() // start spinning

        const finishAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_FINISH_REQUEST_REFILLS })
        expect(finishAction).toBeTruthy()
        expect(finishAction?.state.prescriptions.submittingRequestRefills).toBeFalsy()
        expect(finishAction?.state.prescriptions.showLoadingScreenRequestRefillsRetry).toBeFalsy() // stop spinning
      })
    })
  })

  describe('dispatchClearLoadingRequestRefills', () => {
    it('should clearing properties for refill', async () => {
      const initialState:  Partial<RootState> = {
        prescriptions: {
          ...initialPrescriptionState,
          // Properties for refill
          submittedRequestRefillCount: 1,
          showLoadingScreenRequestRefills: true,
          submittingRequestRefills: true,
          showLoadingScreenRequestRefillsRetry: true
        }
      }
      const store = realStore(initialState)
      await store.dispatch(dispatchClearLoadingRequestRefills())
      const actions = store.getActions()

      const clearAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_CLEAR_LOADING_REQUEST_REFILLS })
      expect(clearAction).toBeTruthy()
      expect(clearAction?.state.prescriptions).toEqual(expect.objectContaining({
        submittedRequestRefillCount: 0,
        showLoadingScreenRequestRefills: false,
        submittingRequestRefills: false,
        showLoadingScreenRequestRefillsRetry: false
      }))
    })
  })

  describe('getTrackingInfo', () => {
    const mockData = {
      "type": "PrescriptionTracking",
      "id": "13650544",
      "attributes": {
        "prescriptionName": "Ibuprofen 200mg",
        "trackingNumber": "abcdefg12345",
        "shippedDate": "2022-10-28T04:00:00.000Z",
        "deliveryService": "USPS",
        "otherPrescriptions": [
          {
            "prescriptionName": "Ibuprofen 200mg",
            "prescriptionNumber": "13650544"
          }
        ]
      }
    }

    it('should get tracking info', async () => {
      when(api.get as jest.Mock).calledWith(`/v0/health/rx/prescriptions/${mockData.id}/tracking`).mockResolvedValue(mockData)

      const store = realStore()
      await store.dispatch(getTrackingInfo(mockData.id))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_START_GET_TRACKING_INFO })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.prescriptions.loadingTrackingInfo).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_FINISH_GET_TRACKING_INFO })
      expect(endAction?.state.prescriptions.loadingTrackingInfo).toBeFalsy()
      expect(endAction?.state.prescriptions.trackingInfo).toEqual(mockData)
    })

    it('should get error if it cant get data', async () => {
      const error = new Error('error from backend')

      when(api.get as jest.Mock).calledWith(`/v0/health/rx/prescriptions/${mockData.id}/tracking`).mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getTrackingInfo(mockData.id))
      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_START_GET_TRACKING_INFO })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.prescriptions.loadingTrackingInfo).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_FINISH_GET_TRACKING_INFO })
      expect(endAction?.state.prescriptions.loadingTrackingInfo).toBeFalsy()
      expect(endAction?.state.prescriptions.trackingInfo).toBeUndefined()
      expect(endAction?.state.prescriptions.error).toEqual(error)
    })
  })
})
