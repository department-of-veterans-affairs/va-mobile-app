import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'

import { InitialState } from 'store/slices'
import { AppointmentPractitioner } from 'store/api/types'
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

  const initializeTestInstance = async (practitioner?: AppointmentPractitioner): Promise<void> => {
    props = mockNavProps({
      practitioner,
      appointmentType: 'VA_VIDEO_CONNECT_ONSITE',
    })

    await waitFor(() => {
      component = render(<ProviderName {...props} />, {
        preloadedState: {
          ...InitialState,
        },
      })
    })

    testInstance = component.container
  }

  beforeEach(async () => {
    await initializeTestInstance(practitionerData)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(TextView).length).toEqual(2)
  })

  describe('when the practitioner prop does not exist', () => {
    it('should not render any TextViews', async () => {
      await initializeTestInstance()
      expect(testInstance.findAllByType(TextView).length).toEqual(0)
    })
  })
})
