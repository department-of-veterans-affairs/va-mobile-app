import React from 'react'

import { screen } from '@testing-library/react-native'

import { AppointmentAttributes, AppointmentStatusConstants, AppointmentTypeConstants } from 'store/api/types'
import { context, render } from 'testUtils'

import ProviderName from './ProviderName'

context('ProviderName', () => {
  const practitionerData = {
    prefix: '',
    firstName: 'Larry',
    middleName: 'Andy',
    lastName: 'Brown',
  }

  const initializeTestInstance = (attributes?: Partial<AppointmentAttributes>): void => {
    const props = {
      appointmentType: 'VA_VIDEO_CONNECT_ONSITE',
      ...(attributes || {}),
    } as AppointmentAttributes

    render(<ProviderName attributes={props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance({ practitioner: practitionerData })
    expect(screen.getByText('Provider')).toBeTruthy()
    expect(screen.getByText('Larry Andy Brown')).toBeTruthy()
  })

  describe('when the practitioner prop does not exist', () => {
    it('should not render any TextViews', () => {
      initializeTestInstance()
      expect(screen.queryByText('Provider')).toBeFalsy()
      expect(screen.queryByText('Larry Andy Brown')).toBeFalsy()
    })
  })

  describe('when phone Appointment with a healthcare provider', () => {
    it('should render any with healthcare provider', () => {
      initializeTestInstance({ phoneOnly: true, healthcareProvider: 'John Adams' })
      expect(screen.getByRole('header', { name: 'Provider' })).toBeTruthy()
      expect(screen.getByText('John Adams')).toBeTruthy()
    })
  })

  describe('when phone Appointment with no healthcare provider', () => {
    it('should render with defaults', () => {
      initializeTestInstance({ phoneOnly: true })
      expect(screen.getByRole('header', { name: 'Provider' })).toBeTruthy()
      expect(screen.getByText('Provider not noted')).toBeTruthy()
    })
  })

  describe('Pending Appointments', () => {
    it('should display healthCareProvider', () => {
      initializeTestInstance({
        appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
        status: AppointmentStatusConstants.SUBMITTED,
        isPending: true,
        healthcareProvider: 'MyHealthCareProvider',
      })
      expect(screen.getByText('MyHealthCareProvider')).toBeTruthy()
    })

    it('should display location.name', () => {
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
      it('should display No provider selected', () => {
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
