import 'react-native'
import React from 'react'

import { screen } from '@testing-library/react-native'
import { context, render } from 'testUtils'
import { AppointmentAttributes, AppointmentStatusConstants, AppointmentTypeConstants } from 'store/api/types'
import ProviderName from './ProviderName'

context('ProviderName', () => {
  let props: any
  let practitionerData = {
    prefix: '',
    firstName: 'Larry',
    middleName: 'Andy',
    lastName: 'Brown',
  }

  const initializeTestInstance = async (attributes?: Partial<AppointmentAttributes>): Promise<void> => {
    props = {
      appointmentType: 'VA_VIDEO_CONNECT_ONSITE',
      ...(attributes || {}),
    }

    render(<ProviderName attributes={props} />)
  }

  it('initializes correctly', async () => {
    initializeTestInstance({ practitioner: practitionerData })
    expect(screen.getByText('Provider')).toBeTruthy()
    expect(screen.getByText('Larry Andy Brown')).toBeTruthy()
  })

  describe('when the practitioner prop does not exist', () => {
    it('should not render any TextViews', async () => {
      initializeTestInstance()
      expect(screen.queryByText('Provider')).toBeFalsy()
      expect(screen.queryByText('Larry Andy Brown')).toBeFalsy()
    })
  })

  describe('Pending Appointments', () => {
    it('should display healthCareProvider', async () => {
      initializeTestInstance({
        appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
        status: AppointmentStatusConstants.SUBMITTED,
        isPending: true,
        healthcareProvider: 'MyHealthCareProvider',
      })
      expect(screen.getByText('MyHealthCareProvider')).toBeTruthy()
    })

    it('should display location.name', async () => {
      initializeTestInstance({
        appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
        status: AppointmentStatusConstants.SUBMITTED,
        isPending: true,
        location: {
          name: 'LocationName',
        },
      })
      expect(screen.getByText('LocationName')).toBeTruthy()
    })

    describe('when no healthCareProvider or location.name is provided', () => {
      it('should display No provider selected', async () => {
        initializeTestInstance({
          appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
          status: AppointmentStatusConstants.SUBMITTED,
          isPending: true,
          location: {
            name: '',
          },
        })
        expect(screen.getByText('No provider selected')).toBeTruthy()
      })
    })
  })
})
