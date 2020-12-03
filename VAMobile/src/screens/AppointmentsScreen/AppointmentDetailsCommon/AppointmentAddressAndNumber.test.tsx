import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import { InitialState } from 'store/reducers'
import { TextView } from 'components'
import AppointmentAddressAndNumber from './AppointmentAddressAndNumber'
import ClickToCallClinic from './ClickToCallClinic'
import { AppointmentAddress } from 'store/api/types'

context('AppointmentAddressAndNumber', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  let addressData = {
    line1: '5901 East 7th Street',
    line2: 'Building 166',
    line3: '12345',
    city: 'Long Beach',
    state: 'CA',
    zipCode: '90822',
  }

  const initializeTestInstance = (appointmentType: string, address: AppointmentAddress | undefined): void => {
    props = mockNavProps({
      appointmentType,
      healthcareService: 'Rehabilitation Clinic',
      locationName: 'VA Long Beach Healthcare System',
      address,
      phone: {
        number: '123-456-7890',
        extension: '',
      },
      isAppointmentCanceled: false
    })

    store = mockStore({
      ...InitialState,
    })

    act(() => {
      component = renderWithProviders(<AppointmentAddressAndNumber {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance('VA', addressData)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the appointment type is not VA/CC/at VA location/ATLAS', () => {
    it('should not render any TextViews', async () => {
      initializeTestInstance('VA_VIDEO_CONNECT_HOME', addressData)
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
      initializeTestInstance('VA_VIDEO_CONNECT_ONSITE', addressData)
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Rehabilitation Clinic')
    })
  })

  describe('when the appointment type is not VA_VIDEO_CONNECT_ATLAS', () => {
    it('should display the location name', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('VA Long Beach Healthcare System')
    })

    it('should render the ClickToCallClinic component', async () => {
      expect(testInstance.findAllByType(ClickToCallClinic).length).toEqual(1)
    })
  })

  describe('when the address exists', () => {
    it('should display address.line1', async () => {
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('5901 East 7th Street')
    })

    it('should display the city state zip formatted', async () => {
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('Long Beach, CA 90822')
    })

    describe('when address.line2 exists', () => {
      it('should be displayed', async () => {
        expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Building 166')
      })
    })

    describe('when address.line3 exists', () => {
      it('should be displayed', async () => {
        expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('12345')
      })
    })
  })

  describe('when the address does not exist', () => {
    it('should not display the address TextViews', async () => {
      initializeTestInstance('VA', undefined)
      expect(testInstance.findAllByType(TextView).length).toEqual(4)
    })
  })
})
