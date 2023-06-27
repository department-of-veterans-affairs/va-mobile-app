import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, findByTypeWithSubstring, render, RenderAPI } from 'testUtils'

import { InitialState } from 'store/slices'
import PreferredDateAndTime from './PreferredDateAndTime'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'
import { AppointmentStatusConstants } from 'store/api/types/AppointmentData'
import { TextView } from 'components'

context('PreferredDateAndTime', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (): void => {
    props = {
      ...defaultAppointmentAttributes,
      isPending: true,
      status: AppointmentStatusConstants.SUBMITTED,
      proposedTimes: [
        {
          date: '10/01/2021',
          time: 'PM',
        },
        {
          date: '',
          time: 'AM',
        },
        {
          date: '11/03/2021',
          time: 'AM',
        },
      ],
    }

    component = render(<PreferredDateAndTime attributes={props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should display proposed times', async () => {
    expect(testInstance.findAllByType(TextView).length).toEqual(3) // 1 header + 2 preferred date and time
    expect(findByTypeWithSubstring(testInstance, TextView, '10/01/2021 in the afternoon')).toBeTruthy()
    expect(findByTypeWithSubstring(testInstance, TextView, '11/03/2021 in the morning')).toBeTruthy()
  })
})
