import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, findByTypeWithSubstring, render, RenderAPI } from 'testUtils'

import { InitialState } from 'store/slices'
import AppointmentAlert from './AppointmentAlert'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'
import { AppointmentLocation, AppointmentStatus, AppointmentStatusConstants, AppointmentStatusDetailType, AppointmentStatusDetailTypeConsts } from 'store/api/types/AppointmentData'
import { AlertBox, TextView } from 'components'

context('AppointmentAlert', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    statusDetail: AppointmentStatusDetailType = AppointmentStatusDetailTypeConsts.CLINIC_REBOOK,
    location?: AppointmentLocation,
  ): void => {
    props = {
      ...defaultAppointmentAttributes,
      status,
      statusDetail,
      location: location || defaultAppointmentAttributes.location,
    }

    component = render(<AppointmentAlert attributes={props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  it('should not show alert for booked appointments', async () => {
    initializeTestInstance()
    const alerts = testInstance.findAllByType(AlertBox)
    expect(alerts.length).toEqual(0)
  })

  it('should not show alert for hidden appointments', async () => {
    initializeTestInstance(AppointmentStatusConstants.HIDDEN)
    const alerts = testInstance.findAllByType(AlertBox)
    expect(alerts.length).toEqual(0)
  })

  describe('when an appointment is CANCELLED', () => {
    describe('when a facility cancels an appointment', () => {
      it('should display facility name', async () => {
        initializeTestInstance(AppointmentStatusConstants.CANCELLED)
        expect(findByTypeWithSubstring(testInstance, TextView, 'VA Long Beach Healthcare System canceled this appointment.')).toBeTruthy()
      })

      it('should display "facility"', async () => {
        initializeTestInstance(AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.CLINIC_REBOOK, { name: '' })
        expect(findByTypeWithSubstring(testInstance, TextView, 'Facility canceled this appointment.')).toBeTruthy()
      })
    })

    describe('when you cancels an appointment', () => {
      it('should display "You"', async () => {
        initializeTestInstance(AppointmentStatusConstants.CANCELLED, AppointmentStatusDetailTypeConsts.PATIENT)
        expect(findByTypeWithSubstring(testInstance, TextView, 'You canceled this appointment.')).toBeTruthy()
      })
    })
  })

  describe('when an appointment is SUBMITTED', () => {
    it('should display facility name', async () => {
      initializeTestInstance(AppointmentStatusConstants.SUBMITTED)
      expect(findByTypeWithSubstring(testInstance, TextView, 'The time and date of this appointment are still to be determined.')).toBeTruthy()
    })
  })
})
