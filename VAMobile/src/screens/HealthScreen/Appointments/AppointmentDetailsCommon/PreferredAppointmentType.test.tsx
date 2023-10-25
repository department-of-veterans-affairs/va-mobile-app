import 'react-native'
import React from 'react'

import { screen } from '@testing-library/react-native'
import { context, render } from 'testUtils'
import PreferredAppointmentType from './PreferredAppointmentType'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'
import { AppointmentStatusConstants, AppointmentType, AppointmentTypeConstants } from 'store/api/types/AppointmentData'

context('PreferredAppointmentType', () => {
  const initializeTestInstance = (appointmentType: AppointmentType, phoneOnly: boolean = false): void => {
    const props = {
      ...defaultAppointmentAttributes,
      appointmentType,
      phoneOnly,
      isPending: true,
      status: AppointmentStatusConstants.SUBMITTED,
    }

    render(<PreferredAppointmentType attributes={props} />)
  }

  describe('when appointmentType is COMMUNITY_CARE', () => {
    it('and phoneOnly is false should show "Office visit"', async () => {
      initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE)
      expect(screen.getByText('Preferred type of appointment')).toBeTruthy()
      expect(screen.getByText('Office visit')).toBeTruthy()
    })
  })

  describe('when appointmentType is video', () => {
    it('should show "Video"', async () => {
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ATLAS)
      expect(screen.getByText('Video')).toBeTruthy()
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE)
      expect(screen.getByText('Video')).toBeTruthy()
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME)
      expect(screen.getByText('Video')).toBeTruthy()
      initializeTestInstance(AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE)
      expect(screen.getByText('Video')).toBeTruthy()
    })
  })

  describe('when appointmentType is COMMUNITY_CARE ', () => {
    describe('and phoneOnly is true ', () => {
      it('should show "Phone call"', async () => {
        initializeTestInstance(AppointmentTypeConstants.COMMUNITY_CARE, true)
        expect(screen.getByText('Phone call')).toBeTruthy()
      })
    })
  })

  describe('when appointmentType VA', () => {
    describe('and phoneOnly is false ', () => {
      it('should show "Office visit"', async () => {
        initializeTestInstance(AppointmentTypeConstants.VA)
        expect(screen.getByText('Office visit')).toBeTruthy()
      })
    })
  })
})
