import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import { InitialState } from 'store/reducers'
import { AppointmentPractitioner } from 'store/api/types'
import { TextView } from 'components'
import ProviderName from './ProviderName'

context('ProviderName', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  let practitionerData = {
    prefix: '',
    firstName: 'Larry',
    middleName: 'Andy',
    lastName: 'Brown',
  }

  const initializeTestInstance = (practitioner?: AppointmentPractitioner): void => {
    props = mockNavProps({
      practitioner,
      appointmentType: 'VA_VIDEO_CONNECT_ONSITE'
    })

    store = mockStore({
      ...InitialState,
    })

    act(() => {
      component = renderWithProviders(<ProviderName {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(practitionerData)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(TextView).length).toEqual(2)
  })

  describe('when the practitioner prop does not exist', () => {
    it('should not render any TextViews', async () => {
      initializeTestInstance()
      expect(testInstance.findAllByType(TextView).length).toEqual(0)
    })
  })
})
