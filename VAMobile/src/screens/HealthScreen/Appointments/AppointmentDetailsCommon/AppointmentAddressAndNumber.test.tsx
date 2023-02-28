import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, render, RenderAPI, waitFor } from 'testUtils'

import { InitialState } from 'store/slices'
import { ClickForActionLink, ClickToCallPhoneNumber, TextView } from 'components'
import AppointmentAddressAndNumber from './AppointmentAddressAndNumber'
import { AppointmentAttributes, AppointmentPhone, AppointmentStatusConstants, AppointmentTypeConstants } from 'store/api/types'

context('AppointmentAddressAndNumber', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = async (attributes?: Partial<AppointmentAttributes>): Promise<void> => {
    props = {
      healthcareService: 'Rehabilitation Clinic',
      location: {
        name: 'VA Long Beach Healthcare System',
        address: {
          street: '5901 East 7th Street',
          city: 'Long Beach',
          state: 'CA',
          zipCode: '90822',
        },
        phone: {
          areaCode: '123',
          number: '456-7890',
          extension: '',
        },
      },
      ...(attributes || {}),
    } as AppointmentAttributes

    await waitFor(() => {
      component = render(<AppointmentAddressAndNumber attributes={props} />, {
        preloadedState: {
          ...InitialState,
        },
      })
    })

    testInstance = component.container
  }

  beforeEach(async () => {
    await initializeTestInstance({
      appointmentType: AppointmentTypeConstants.VA,
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the appointment type is not VA/CC/at VA location/ATLAS', () => {
    it('should not render any TextViews', async () => {
      await initializeTestInstance({
        appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME,
      })
      expect(testInstance.findAllByType(TextView).length).toEqual(0)
    })
  })

  describe('when the appointmentType is VA', () => {
    it('should display the healthcareService', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Rehabilitation Clinic')
    })
  })

  describe('when the appointmentType is VA_VIDEO_CONNECT_ONSITE', () => {
    it('should display the healthcareService', async () => {
      await initializeTestInstance({
        appointmentType: AppointmentTypeConstants.VA_VIDEO_CONNECT_ONSITE,
      })
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Rehabilitation Clinic')
    })
  })

  describe('when the appointment type is not VA_VIDEO_CONNECT_ATLAS', () => {
    it('should display the location name', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('VA Long Beach Healthcare System')
    })

    it('should render the ClickToCallPhoneNumber component', async () => {
      expect(testInstance.findAllByType(ClickToCallPhoneNumber).length).toEqual(1)
    })
  })

  describe('when the address exists', () => {
    it('should display address.street', async () => {
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('5901 East 7th Street')
    })

    it('should display the city state zip formatted', async () => {
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Long Beach, CA 90822')
    })
  })

  describe('when the address does not exist', () => {
    it('should not display the address TextViews', async () => {
      await initializeTestInstance({
        appointmentType: AppointmentTypeConstants.VA,
        location: {
          name: 'VA Long Beach Healthcare System',
          address: undefined,
          phone: {
            areaCode: '123',
            number: '456-7890',
            extension: '',
          },
        },
      })
      expect(testInstance.findAllByType(TextView).length).toEqual(5)
    })
  })

  describe('when the phone number exists', () => {
    it('should display the phone number', async () => {
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('123-456-7890')
    })
  })

  describe('when the phone number does not exist', () => {
    it('should not display the phone number', async () => {
      await initializeTestInstance({
        appointmentType: AppointmentTypeConstants.VA,
        location: {
          name: 'VA Long Beach Healthcare System',
          address: {
            street: '5901 East 7th Street',
            city: 'Long Beach',
            state: 'CA',
            zipCode: '90822',
          },
          phone: {} as AppointmentPhone,
        },
      })
      expect(testInstance.findAllByType(TextView).length).toEqual(5)
    })
  })

  describe('default', () => {
    it('should render the Get Directions component', async () => {
      expect(testInstance.findAllByType(ClickForActionLink).length).toBeTruthy()
    })
  })

  describe('Pending Appointments', () => {
    describe('when no healthcareProvider and location.name is given', () => {
      it('should not display any address information ', async () => {
        await initializeTestInstance({
          appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
          status: AppointmentStatusConstants.SUBMITTED,
          isPending: true,
          healthcareProvider: null,
          location: {
            name: '',
          },
        })
        expect(testInstance.findAllByType(TextView).length).toEqual(0)
      })
    })

    describe('when healthcareProvider is given', () => {
      it('should display location name ', async () => {
        await initializeTestInstance({
          appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
          status: AppointmentStatusConstants.SUBMITTED,
          isPending: true,
          healthcareProvider: 'Health Care Provider',
        })
        expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA Long Beach Healthcare System')
      })
    })
  })
})
