import _ from 'underscore'
import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import { defaultPrescriptionsList as mockData, defaultLoadAllPrescriptionsList as loadAllPrescriptionMockData } from 'utils/tests/prescription'
import { RootState } from 'store'
import {
  dispatchClearLoadingRequestRefills, dispatchSetPrescriptionsNeedLoad,
  getTrackingInfo,
  initialPrescriptionState, loadAllPrescriptions,
  requestRefills
} from './prescriptionSlice'
import { RefillRequestSummaryItems } from '../api'

export const ActionTypes: {
  PRESCRIPTION_START_REQUEST_REFILLS: string
  PRESCRIPTION_FINISH_REQUEST_REFILLS: string
  PRESCRIPTION_CLEAR_LOADING_REQUEST_REFILLS: string
  PRESCRIPTION_START_GET_TRACKING_INFO: string
  PRESCRIPTION_FINISH_GET_TRACKING_INFO: string
  PRESCRIPTION_START_LOAD_ALL_PRESCRIPTIONS: string
  PRESCRIPTION_FINISH_LOAD_ALL_PRESCRIPTIONS: string
  PRESCRIPTION_SET_PRESCRIPTIONS_NEED_LOAD: string
} = {
  PRESCRIPTION_START_REQUEST_REFILLS: 'prescriptions/dispatchStartRequestRefills',
  PRESCRIPTION_FINISH_REQUEST_REFILLS: 'prescriptions/dispatchFinishRequestRefills',
  PRESCRIPTION_CLEAR_LOADING_REQUEST_REFILLS: 'prescriptions/dispatchClearLoadingRequestRefills',
  PRESCRIPTION_START_GET_TRACKING_INFO: 'prescriptions/dispatchStartGetTrackingInfo',
  PRESCRIPTION_FINISH_GET_TRACKING_INFO: 'prescriptions/dispatchFinishGetTrackingInfo',
  PRESCRIPTION_START_LOAD_ALL_PRESCRIPTIONS: 'prescriptions/dispatchStartLoadAllPrescriptions',
  PRESCRIPTION_FINISH_LOAD_ALL_PRESCRIPTIONS: 'prescriptions/dispatchFinishLoadAllPrescriptions',
  PRESCRIPTION_SET_PRESCRIPTIONS_NEED_LOAD: 'prescriptions/dispatchSetPrescriptionsNeedLoad',
}

context('Prescription', () => {
  describe('requestRefills', () => {
    describe('when all refills are successful', () => {
      it('should update refillRequestSummaryItems with all submitted items', async () => {
        when(api.put as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions/refill', {'ids': [mockData[0].id, mockData[1].id]})
          .mockResolvedValue({
            "data": {
              "id": "3097e489-ad75-5746-ab1a-e0aabc1b426a",
              "type": "PrescriptionRefills",
              "attributes": {
                "failedStationList": "DAYT29, DAYT29",
                "successfulStationList": "SLC4, VAMCSLC-OUTPTRX",
                "lastUpdatedTime": "Thu, 08 Dec 2022 12:11:33 EST",
                "prescriptionList": null,
                "failedPrescriptionIds": [],
                "errors": [],
                "infoMessages": []
              }
            }
          })
  
        const store = realStore()
        await store.dispatch(requestRefills(mockData))
        const actions = store.getActions()
  
        const finishAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_FINISH_REQUEST_REFILLS })
        expect(finishAction).toBeTruthy()
        expect(finishAction?.state.prescriptions.submittingRequestRefills).toBeFalsy()
        expect(finishAction?.state.prescriptions.showLoadingScreenRequestRefillsRetry).toBeFalsy()
        expect(finishAction?.state.prescriptions.refillRequestSummaryItems).toEqual([
          {
            data: mockData[0],
            submitted: true,
          },
          {
            data: mockData[1],
            submitted: true,
          }
        ])
      })
    })

    describe('when all refills are unsuccessful', () => {
      it('should update refillRequestSummaryItems with all non-submitted items', async () => {
        when(api.put as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions/refill', {'ids': [mockData[0].id, mockData[1].id]})
          .mockResolvedValue({
            "data": {
              "id": "3097e489-ad75-5746-ab1a-e0aabc1b426a",
              "type": "PrescriptionRefills",
              "attributes": {
                "failedStationList": "DAYT29, DAYT29",
                "successfulStationList": "SLC4, VAMCSLC-OUTPTRX",
                "lastUpdatedTime": "Thu, 08 Dec 2022 12:11:33 EST",
                "prescriptionList": null,
                "failedPrescriptionIds": [mockData[0].id, mockData[1].id],
                "errors": [
                  {
                    "errorCode": 139,
                    "developerMessage": `Prescription not refillable for id : ${mockData[0].id}`,
                    "message": "Prescription is not Refillable"
                  },
                  {
                    "errorCode": 139,
                    "developerMessage": `Prescription not refillable for id : ${mockData[1].id}`,
                    "message": "Prescription is not Refillable"
                  }
                ],
                "infoMessages": []
              }
            }
          })
  
        const store = realStore()
        await store.dispatch(requestRefills(mockData))
        const actions = store.getActions()
  
        const finishAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_FINISH_REQUEST_REFILLS })
        expect(finishAction).toBeTruthy()
        expect(finishAction?.state.prescriptions.submittingRequestRefills).toBeFalsy()
        expect(finishAction?.state.prescriptions.showLoadingScreenRequestRefillsRetry).toBeFalsy()
        expect(finishAction?.state.prescriptions.refillRequestSummaryItems).toEqual([
          {
            data: mockData[0],
            submitted: false,
          },
          {
            data: mockData[1],
            submitted: false,
          }
        ])
      })
    })

    describe('when some refills are successful', () => {
      it('should update refillRequestSummaryItems with submitted and non-submitted items', async () => {
        when(api.put as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions/refill', {'ids': [mockData[0].id, mockData[1].id]})
          .mockResolvedValue({
            "data": {
              "id": "3097e489-ad75-5746-ab1a-e0aabc1b426a",
              "type": "PrescriptionRefills",
              "attributes": {
                "failedStationList": "DAYT29, DAYT29",
                "successfulStationList": "SLC4, VAMCSLC-OUTPTRX",
                "lastUpdatedTime": "Thu, 08 Dec 2022 12:11:33 EST",
                "prescriptionList": null,
                "failedPrescriptionIds": [mockData[0].id],
                "errors": [
                  {
                    "errorCode": 139,
                    "developerMessage": `Prescription not refillable for id : ${mockData[0].id}`,
                    "message": "Prescription is not Refillable"
                  },
                ],
                "infoMessages": []
              }
            }
          })
  
        const store = realStore()
        await store.dispatch(requestRefills(mockData))
        const actions = store.getActions()
  
        const finishAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_FINISH_REQUEST_REFILLS })
        expect(finishAction).toBeTruthy()
        expect(finishAction?.state.prescriptions.submittingRequestRefills).toBeFalsy()
        expect(finishAction?.state.prescriptions.showLoadingScreenRequestRefillsRetry).toBeFalsy()
        expect(finishAction?.state.prescriptions.refillRequestSummaryItems).toEqual([
          {
            data: mockData[0],
            submitted: false,
          },
          {
            data: mockData[1],
            submitted: true,
          }
        ])
      })
    })

    describe('on RefillScreen', () => {
      it('should continue to show loading spinner after completing', async () => {
        when(api.put as jest.Mock)
          .calledWith('/v0/health/rx/prescriptions/refill', {'ids': [mockData[0].id, mockData[1].id]})
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
          .calledWith('/v0/health/rx/prescriptions/refill', {'ids': [mockData[0].id, mockData[1].id]})
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

  describe('dispatchSetPrescriptionsNeedLoad', () => {
    describe('if some successfully submit', () => {
      it('should set prescriptionsNeedLoad to true', async () => {
        const store = realStore({
          prescriptions: {
            ...initialPrescriptionState,
            prescriptionsNeedLoad: false,
            refillRequestSummaryItems: [
              {
                data: mockData[0],
                submitted: true,
              },
              {
                data: mockData[1],
                submitted: false,
              }
            ]
          }
        })
        await store.dispatch(dispatchSetPrescriptionsNeedLoad())
        const actions = store.getActions()

        const finishAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_SET_PRESCRIPTIONS_NEED_LOAD })
        expect(finishAction).toBeTruthy()
        expect(finishAction?.state.prescriptions.prescriptionsNeedLoad).toBeTruthy()
      })
    })

    describe('if all failed to submit', () => {
      it('should set prescriptionsNeedLoad to false', async () => {
        const store = realStore({
          prescriptions: {
            ...initialPrescriptionState,
            prescriptionsNeedLoad: true,
            refillRequestSummaryItems: [
              {
                data: mockData[0],
                submitted: false,
              },
              {
                data: mockData[1],
                submitted: false,
              }
            ]
          }
        })
        await store.dispatch(dispatchSetPrescriptionsNeedLoad())
        const actions = store.getActions()

        const finishAction = _.find(actions, { type: ActionTypes.PRESCRIPTION_SET_PRESCRIPTIONS_NEED_LOAD })
        expect(finishAction).toBeTruthy()
        expect(finishAction?.state.prescriptions.prescriptionsNeedLoad).toBeFalsy()
      })
    })
  })

  describe('dispatchClearLoadingRequestRefills', () => {
    it('should clearing properties for refill', async () => {
      const initialState:  Partial<RootState> = {
        prescriptions: {
          ...initialPrescriptionState,
          // Properties for refill
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
