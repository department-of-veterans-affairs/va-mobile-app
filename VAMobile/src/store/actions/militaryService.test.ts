import _ from "underscore";

import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import { getServiceHistory } from './militaryService'

context('militaryService', () => {
  describe('getServiceHistory', () => {
    it('should get users service history', async () => {
      const mockHistoryPayload: api.MilitaryServiceHistoryData = {
        data: {
          type: 'militaryInformatioon',
          id: 'abe3f152-90b0-45cb-8776-4958bad0e0ef',
          attributes: {
            service_history: [
              {
                branch_of_service: "United States Marine Corps",
                begin_date: "1997-09-17",
                end_date: "2002-12-31",
                formatted_begin_date: "September 17, 1997",
                formatted_end_date: "December 31, 2002"
              }
            ]
          }
        }
      }

      when(api.get as jest.Mock)
          .calledWith('/v0/military-service-history')
          .mockResolvedValue(mockHistoryPayload)

      const store = realStore()
      await store.dispatch(getServiceHistory())
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'MILITARY_SERVICE_START_GET_HISTORY' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.militaryService.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'MILITARY_SERVICE_FINISH_GET_HISTORY' })
      expect(endAction?.state.militaryService.loading).toBeFalsy()
      expect(endAction?.state.militaryService.error).toBeFalsy()

      const { militaryService } = store.getState()
      expect(militaryService.serviceHistory).toEqual(mockHistoryPayload.data.attributes.service_history)
      expect(militaryService.error).toBeFalsy()
    })

    it('should get error if it cant get data', async () => {
      const error = new Error('error from backend')

      when(api.get as jest.Mock)
          .calledWith('/v0/military-service-history')
          .mockResolvedValue(Promise.reject(error))

      const store = realStore()
      await store.dispatch(getServiceHistory())
      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'MILITARY_SERVICE_START_GET_HISTORY' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.militaryService.loading).toBeTruthy()

      const endAction = _.find(actions, { type: 'MILITARY_SERVICE_FINISH_GET_HISTORY' })
      expect(endAction?.state.militaryService.loading).toBeFalsy()
      expect(endAction?.state.militaryService.error).toBeTruthy()

      const { militaryService } = store.getState()
      expect(militaryService.serviceHistory).toEqual([])
      expect(militaryService.error).toEqual(error)
    })
  })
})
