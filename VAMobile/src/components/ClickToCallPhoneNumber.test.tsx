import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import { InitialState } from 'store/reducers'
import { AppointmentPhone } from 'store/api/types'
import { ClickForActionLink, ClickToCallPhoneNumber, TextView } from 'components'

context('ClickToCallPhoneNumber', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  let phoneData = {
    areaCode: '123',
    number: '456-7890',
    extension: '12',
  }

  const initializeTestInstance = (phone?: AppointmentPhone): void => {
    props = mockNavProps({
      phone
    })

    store = mockStore({
      ...InitialState,
    })

    act(() => {
      component = renderWithProviders(<ClickToCallPhoneNumber {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(phoneData)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(ClickForActionLink).length).toEqual(2)
  })

  it('should render all text views', async () => {
    expect(testInstance.findAllByType(TextView).length).toEqual(4)
    expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('123-456-7890')
    expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('If you have hearing loss, call TTY:')
    expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('711')
    expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Tap the first link to make a voice or TTY call. Tap the second link if you would like help making a TTY call.')
  })

  describe('when the phone prop does not exist', () => {
    it('should not return a ClickForActionLink component', async () => {
      initializeTestInstance()
      expect(testInstance.findAllByType(ClickForActionLink).length).toEqual(0)
      expect(testInstance.findAllByType(TextView).length).toEqual(0)
    })
  })
})
