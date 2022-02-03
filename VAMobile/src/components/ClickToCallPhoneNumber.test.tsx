import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, render } from 'testUtils'

import { AppointmentPhone } from 'store/api/types'
import { ClickForActionLink, ClickToCallPhoneNumber, TextView } from 'components'
import { InitialState } from 'store/slices'
import { RenderAPI } from '@testing-library/react-native'

context('ClickToCallPhoneNumber', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  let phoneData = {
    areaCode: '123',
    number: '456-7890',
    extension: '12',
  }

  const initializeTestInstance = (phone?: AppointmentPhone): void => {
    props = mockNavProps({
      phone,
    })

    component = render(<ClickToCallPhoneNumber {...props} />, { preloadedState: { ...InitialState } })

    testInstance = component.container
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
    expect(testInstance.findAllByType(TextView)[3].props.children).toEqual(
      'To make a voice or TTY call, tap the first link. If you’d like help to make a TTY call, tap the second link.',
    )
  })

  describe('when the phone prop does not exist', () => {
    it('should not return a ClickForActionLink component', async () => {
      initializeTestInstance()
      expect(testInstance.findAllByType(ClickForActionLink).length).toEqual(0)
      expect(testInstance.findAllByType(TextView).length).toEqual(0)
    })
  })
})
