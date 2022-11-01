import _ from 'underscore'
import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import { defaultPrescriptionsList as mockData, defaultLoadAllPrescriptionsList as loadAllPrescriptionMockData } from 'utils/tests/prescription'
import { RootState } from 'store'
import {
  dispatchClearLoadingRequestRefills,
  getTrackingInfo,
  initialPrescriptionState, loadAllPrescriptions,
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
  PRESCRIPTION_START_LOAD_ALL_PRESCRIPTIONS: string
  PRESCRIPTION_FINISH_LOAD_ALL_PRESCRIPTIONS: string
} = {
  PRESCRIPTION_START_REQUEST_REFILLS: 'prescriptions/dispatchStartRequestRefills',
  PRESCRIPTION_CONTINUE_REQUEST_REFILLS: 'prescriptions/dispatchContinueRequestRefills',
  PRESCRIPTION_FINISH_REQUEST_REFILLS: 'prescriptions/dispatchFinishRequestRefills',
  PRESCRIPTION_CLEAR_LOADING_REQUEST_REFILLS: 'prescriptions/dispatchClearLoadingRequestRefills',
  PRESCRIPTION_START_GET_TRACKING_INFO: 'prescriptions/dispatchStartGetTrackingInfo',
  PRESCRIPTION_FINISH_GET_TRACKING_INFO: 'prescriptions/dispatchFinishGetTrackingInfo',
  PRESCRIPTION_START_LOAD_ALL_PRESCRIPTIONS: 'prescriptions/dispatchStartLoadAllPrescriptions',
  PRESCRIPTION_FINISH_LOAD_ALL_PRESCRIPTIONS: 'prescriptions/dispatchFinishLoadAllPrescriptions',
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
      expect(startAction?.state.prescriptions.totalSubmittedRequestRefill).toEqual(2)

      // Submitting second request
      const continueAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_CONTINUE_REQUEST_REFILLS })
      expect(continueAction).toBeTruthy()
      expect(continueAction?.state.prescriptions.submittedRequestRefillCount).toEqual(2)
      expect(startAction?.state.prescriptions.totalSubmittedRequestRefill).toEqual(2)

      // finish should stay the same
      const finishAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_FINISH_REQUEST_REFILLS })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.prescriptions.submittedRequestRefillCount).toEqual(2)
      expect(startAction?.state.prescriptions.totalSubmittedRequestRefill).toEqual(2)
    })

    describe('if some successfully submit', () => {
      it('should set needsRefillableLoaded and prescriptionsNeedLoad to true', async () => {
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
        expect(finishAction?.state.prescriptions.prescriptionsNeedLoad).toBeTruthy()
      })
    })

    describe('if all failed to submit', () => {
      it('should set needsRefillableLoaded and prescriptionsNeedLoad to false', async () => {
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
        expect(finishAction?.state.prescriptions.prescriptionsNeedLoad).toBeFalsy()
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
          totalSubmittedRequestRefill: 1,
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
        totalSubmittedRequestRefill: 0,
        showLoadingScreenRequestRefills: false,
        submittingRequestRefills: false,
        showLoadingScreenRequestRefillsRetry: false
      }))
    })
  })

  describe('getTrackingInfo', () => {
    const mockData = [{
      "type": "PrescriptionTracking",
      "id": "13650544",
      "attributes": {
        "prescriptionName": "Ibuprofen 200mg",
        "trackingNumber": "abcdefg12345",
        "shippedDate": "2022-10-28T04:00:00.000Z",
        "deliveryService": "USPS",
        "ndcNumber": "00013264681",
        "prescriptionId": 13650544,
        "otherPrescriptions": [
          {
            "prescriptionName": "Ibuprofen 200mg",
            "prescriptionNumber": "13650544"
          }
        ]
      }
    }]

    it('should get tracking info', async () => {
      when(api.get as jest.Mock).calledWith(`/v0/health/rx/prescriptions/${mockData[0].id}/tracking`).mockResolvedValue({ data: mockData })

      const store = realStore()
      await store.dispatch(getTrackingInfo(mockData[0].id))
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

      when(api.get as jest.Mock).calledWith(`/v0/health/rx/prescriptions/${mockData[0].id}/tracking`).mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getTrackingInfo(mockData[0].id))
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

  describe('loadAllPrescriptions', () => {
    it('should filter shipped, processing, transferred, and refillable prescriptions into their own lists', async () => {
      when(api.get as jest.Mock)
      .calledWith('/v0/health/rx/prescriptions', expect.anything())
      .mockResolvedValue({
        data: loadAllPrescriptionMockData,
        meta: {}
      })

      const store = realStore()
      await store.dispatch(loadAllPrescriptions())
      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_START_LOAD_ALL_PRESCRIPTIONS })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.prescriptions.loadingHistory).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_FINISH_LOAD_ALL_PRESCRIPTIONS })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.prescriptions.loadingHistory).toBeFalsy()
      // Total prescriptions
      expect(endAction?.state.prescriptions.prescriptions?.length).toEqual(5)

      expect(endAction?.state.prescriptions.pendingPrescriptions?.length).toEqual(2)
      expect(endAction?.state.prescriptions.shippedPrescriptions?.length).toEqual(1)
      expect(endAction?.state.prescriptions.transferredPrescriptions?.length).toEqual(1)
      expect(endAction?.state.prescriptions.refillablePrescriptions?.length).toEqual(1)
    })
  })
})
