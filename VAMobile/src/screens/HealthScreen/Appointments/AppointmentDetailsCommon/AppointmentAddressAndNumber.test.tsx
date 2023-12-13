import React from 'react'
import { screen } from '@testing-library/react-native'

import { render } from 'testUtils'
import AppointmentAddressAndNumber from './AppointmentAddressAndNumber'
import { AppointmentAttributes, AppointmentPhone, AppointmentStatusConstants, AppointmentTypeConstants } from 'store/api/types'

const appointmentType = AppointmentTypeConstants.VA
const healthcareService = 'Rehabilitation Clinic'
const name = 'VA Long Beach Healthcare System'
const address = {
  street: '5901 East 7th Street',
  city: 'Long Beach',
  state: 'CA',
  zipCode: '90822',
}
const phone = {
  areaCode: '123',
  number: '456-7890',
  extension: '',
}

describe('AppointmentAddressAndNumber', () => {
  const renderWithProps = (attributes?: Partial<AppointmentAttributes>) => {
    const props = {
      appointmentType,
      healthcareService,
      location: { name, address, phone },
      ...(attributes || {}),
    } as AppointmentAttributes
    render(<AppointmentAddressAndNumber attributes={props} isPastAppointment={false}/>)
  }

  beforeEach(() => {
    renderWithProps()
  })

  describe('when the appointment type is not VA/CC/at VA location/ATLAS', () => {
    it('does not show name or address', () => {
      renderWithProps({ appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME })
      expect(screen.queryByText(name)).toBeNull()
      expect(screen.queryByText('5901 East 7th Street')).toBeNull()
    })
  })

  describe('when the appointment is phoneOnly', () => {
    it('does not show name or address', () => {
      renderWithProps({ phoneOnly: true })
      expect(screen.queryByText(name)).toBeNull()
      expect(screen.queryByText('5901 East 7th Street')).toBeNull()
    })
  })

  describe('when the appointmentType is VA_VIDEO_CONNECT_ONSITE', () => {
    it('displays the healthcareService', () => {
      renderWithProps({ appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE })
      expect(screen.getByText(healthcareService)).toBeTruthy()
    })
  })

  describe('when the appointment type is not VA_VIDEO_CONNECT_ATLAS', () => {
    it('displays the location name and phone number', () => {
      expect(screen.getByText(name)).toBeTruthy()
      expect(screen.getByText('123-456-7890')).toBeTruthy()
    })
  })

  describe('when the address exists', () => {
    it('displays the address', () => {
      expect(screen.getByText('5901 East 7th Street')).toBeTruthy()
      expect(screen.getByText('Long Beach, CA 90822')).toBeTruthy()
    })
  })

  describe('when the address does not exist', () => {
    it('displays the correct message', () => {
      renderWithProps({ location: { name, address: undefined, phone } })
      expect(screen.getByText(/We can't show your health care facility's address right now. Try again later. Or call your facility to get the address./)).toBeTruthy()
      expect(screen.getByRole('link', {name: '123-456-7890' })).toBeTruthy()
      expect(screen.getByRole('link', {name: 'TTY: 711' })).toBeTruthy()
    })
  })

  describe('when the phone number exists', () => {
    it('displays the phone number', () => {
      expect(screen.getByText('123-456-7890')).toBeTruthy()
    })
  })

  describe('when the phone number does not exist', () => {
    it('does not display the phone number', () => {
      renderWithProps({ location: { name, address, phone: {} as AppointmentPhone } })
      expect(screen.queryByText('123-456-7890')).toBeNull()
    })
  })

  describe('when phone and address do not exist', () => {
    it('displays the correct message and the facility locator link', () => {
      renderWithProps({ location: { name, address: undefined, phone: {} as AppointmentPhone } })
      expect(screen.getByText(/We can't show your health care facility's address or phone number right now. Try again later. Or go to VA.gov to find your facility's information./)).toBeTruthy()
      expect(screen.getByRole('link', {name: 'Go to VA.gov to find your VA facility' })).toBeTruthy()
    })
  })

  describe('default', () => {
    it('renders the Get Directions component', () => {
      expect(screen.getByText('Get directions')).toBeTruthy()
    })
  })

  describe('Pending Appointments', () => {
    describe('when no healthcareProvider and location.name is given', () => {
      it('does not display any address information', () => {
        renderWithProps({
          appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
          status: AppointmentStatusConstants.SUBMITTED,
          isPending: true,
          healthcareProvider: null,
          location: { name: '' },
        })
        expect(screen.queryByText('5901 East 7th Street')).toBeNull()
        expect(screen.queryByText('Long Beach, CA 90822')).toBeNull()
      })

      describe('when healthcareProvider is given', () => {
        it('displays location name', () => {
          renderWithProps({
            appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
            status: AppointmentStatusConstants.SUBMITTED,
            isPending: true,
            healthcareProvider: 'Health Care Provider',
          })
          expect(screen.getByText(name)).toBeTruthy()
        })
      })
    })
  })
})
