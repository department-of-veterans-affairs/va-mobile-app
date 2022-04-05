import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, findByTypeWithSubstring, mockNavProps, mockStore, render, RenderAPI, waitFor } from 'testUtils'

import { InitialState } from 'store/slices'
import { AppointmentStatusDetailTypeConsts, AppointmentStatusDetailType } from 'store/api/types'
import AppointmentTypeAndDate from './AppointmentTypeAndDate'
import { TextView } from 'components'

context('AppointmentTypeAndDate', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = async (isAppointmentCanceled: boolean = false, whoCanceled: AppointmentStatusDetailType | null = null): Promise<void> => {
    props = mockNavProps({
      appointmentType: 'VA',
      startDateUtc: '2021-02-06T19:53:14.000+00:00',
      startDateLocal: '2021-02-06T18:53:14.000-01:00',
      timeZone: 'America/Los_Angeles',
      isAppointmentCanceled,
      whoCanceled,
    })

    await waitFor(() => {
      component = render(<AppointmentTypeAndDate {...props} />, {
        preloadedState: {
          ...InitialState,
        },
      })
    })

    testInstance = component.container
  }

  beforeEach(async () => {
    await initializeTestInstance(false)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when isAppointmentCanceled is true', () => {
    it('should render a TextView with the cancellation text', async () => {
      await initializeTestInstance(true)
      expect(findByTypeWithSubstring(testInstance, TextView, 'canceled this appointment')).toBeTruthy()
    })
  })

  describe('when isAppointmentCanceled is false', () => {
    it('should only render 3 TextViews', async () => {
      expect(testInstance.findAllByType(TextView).length).toEqual(3)
    })
  })
})
