import 'react-native'
import React from 'react'
import { screen } from '@testing-library/react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, findByTypeWithSubstring, mockNavProps, mockStore, render, RenderAPI, waitFor } from 'testUtils'

import { InitialState } from 'store/slices'
import { AppointmentStatusDetailType, AppointmentStatus, AppointmentStatusConstants } from 'store/api/types'
import AppointmentTypeAndDate from './AppointmentTypeAndDate'
import { TextView } from 'components'

context('AppointmentTypeAndDate', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = async (
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    statusDetail: AppointmentStatusDetailType | null = null,
    isPending: boolean = false,
    serviceCategoryName: string | null = null,
  ): Promise<void> => {
    props = {
      appointmentType: 'VA',
      startDateUtc: '2021-02-06T19:53:14.000+00:00',
      startDateLocal: '2021-02-06T18:53:14.000-01:00',
      timeZone: 'America/Los_Angeles',
      status,
      statusDetail,
      isPending,
      typeOfCare: 'typeOfCare',
      serviceCategoryName,
    }

    await waitFor(() => {
      component = render(<AppointmentTypeAndDate attributes={props} isPastAppointment={false} />, {
        preloadedState: {
          ...InitialState,
        },
      })
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(async () => {
    await initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when isAppointmentCanceled is true', () => {
    it('should render a TextView with the cancellation text', async () => {
      await initializeTestInstance(AppointmentStatusConstants.CANCELLED)
      expect(findByTypeWithSubstring(testInstance, TextView, 'Canceled appointment for')).toBeTruthy()
    })
  })

  describe('when isAppointmentCanceled is false', () => {
    it('should only render 2 TextViews', async () => {
      expect(testInstance.findAllByType(TextView).length).toEqual(2)
    })
  })

  describe('when isPending is true and status is SUBMITTED', () => {
    it('should render TypeOfCare text', async () => {
      await initializeTestInstance(AppointmentStatusConstants.SUBMITTED, null, true)
      expect(findByTypeWithSubstring(testInstance, TextView, 'Pending request for typeOfCare appointment')).toBeTruthy()
    })
  })

  describe('when the serviceCategoryName is C&P', () => {
    it('should display the correct text', async () => {
      initializeTestInstance(AppointmentStatusConstants.BOOKED, null, false, 'COMPENSATION & PENSION')
      expect(screen.getByText('Claim exam')).toBeTruthy()
      expect(screen.getByText("This appointment is for disability rating purposes only. It doesn't include treatment. If you have medical evidence to support your claim, bring copies to this appointment.")).toBeTruthy()
    })
  })
})
