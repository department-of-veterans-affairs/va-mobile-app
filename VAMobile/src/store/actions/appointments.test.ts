import _ from 'underscore'

import {context, realStore} from 'testUtils'
import {getAppointment, getAppointmentsInDateRange, TimeFrameType} from './appointments'

context('appointments', () => {
  describe('getAppointmentsInDateRange', () => {
    it('should dispatch the correct actions', async () => {
      // TODO: add more tests when using the api instead of mocked data
      const store = realStore()
      const startDate = '2021-02-06T04:30:00.000+00:00'
      const endDate = '2021-02-06T05:30:00.000+00:00'
      await store.dispatch(getAppointmentsInDateRange(startDate, endDate, TimeFrameType.PAST))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'APPOINTMENTS_START_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'APPOINTMENTS_FINISH_GET_APPOINTMENTS_IN_DATE_RANGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.appointments.loading).toBe(false)

      const { appointments } = store.getState()
      expect(appointments.error).toBeFalsy()
    })
  })

  describe('getAppointment', () => {
    it('should dispatch the correct actions', async () => {
      // TODO: add more tests when using the api instead of mocked data
      const store = realStore()
      await store.dispatch(getAppointment('1'))

      const actions = store.getActions()

      const action = _.find(actions, { type: 'APPOINTMENTS_GET_APPOINTMENT' })
      expect(action).toBeTruthy()

      const { appointments } = store.getState()
      expect(appointments.error).toBeFalsy()
    })
  })
})
