import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, findByTypeWithSubstring, render, RenderAPI } from 'testUtils'

import { InitialState } from 'store/slices'
import PreferredAppointmentType from './PreferredAppointmentType'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'
import { AppointmentStatusConstants, AppointmentType, AppointmentTypeConstants } from 'store/api/types/AppointmentData'
import { TextView } from 'components'

context('PreferredAppointmentType', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (appointmentType: AppointmentType, phoneOnly: boolean = false): void => {
    props = {
      ...defaultAppointmentAttributes,
      appointmentType,
      phoneOnly,
      isPending: true,
      status: AppointmentStatusConstants.SUBMITTED,
    }

    component = render(<PreferredAppointmentType attributes={props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE)
    expect(component).toBeTruthy()
  })

  describe('when appointmentType is video', () => {
    it('should show "Video"', async () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS)
      expect(findByTypeWithSubstring(testInstance, TextView, 'Video')).toBeTruthy()
    })
  })

  describe('when appointmentType is COMMUNITY_CARE ', () => {
    describe('and phoneOnly is true ', () => {
      it('should show "Phone call"', async () => {
        initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE, true)
        expect(findByTypeWithSubstring(testInstance, TextView, 'Phone call')).toBeTruthy()
      })
    })
  })

  describe('when appointmentType VA', () => {
    describe('and phoneOnly is false ', () => {
      it('should show "Office visit"', async () => {
        initializeTestInstance(AppointmentTypeConstants.VA)
        expect(findByTypeWithSubstring(testInstance, TextView, 'Office visit')).toBeTruthy()
      })
    })
  })
})
