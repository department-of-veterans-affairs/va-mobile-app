import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'

import { InitialState } from 'store/slices'
import { AppointmentAttributes, AppointmentStatusConstants, AppointmentTypeConstants } from 'store/api/types'
import { TextView } from 'components'
import ProviderName from './ProviderName'

context('ProviderName', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

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

    await waitFor(() => {
      component = render(<ProviderName attributes={props} />, {
        preloadedState: {
          ...InitialState,
        },
      })
    })

    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    await initializeTestInstance({ practitioner: practitionerData })
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(TextView).length).toEqual(2)
  })

  describe('when the practitioner prop does not exist', () => {
    it('should not render any TextViews', async () => {
      await initializeTestInstance()
      expect(testInstance.findAllByType(TextView).length).toEqual(0)
    })
  })

  describe('Pending Appointments', () => {
    it('should display healthCareProvider', async () => {
      await initializeTestInstance({
        appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
        status: AppointmentStatusConstants.SUBMITTED,
        isPending: true,
        healthcareProvider: 'MyHealthCareProvider',
      })
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('MyHealthCareProvider')
    })

    it('should display location.name', async () => {
      await initializeTestInstance({
        appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
        status: AppointmentStatusConstants.SUBMITTED,
        isPending: true,
        location: {
          name: 'LocationName',
        },
      })
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('LocationName')
    })

    describe('when no healthCareProvider or location.name is provided', () => {
      it('should display No provider selected', async () => {
        await initializeTestInstance({
          appointmentType: AppointmentTypeConstants.COMMUNITY_CARE,
          status: AppointmentStatusConstants.SUBMITTED,
          isPending: true,
          location: {
            name: '',
          },
        })
        expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('No provider selected')
      })
    })
  })
})
