import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import { InitialState } from 'store/reducers'
import ClickToCallClinic from './ClickToCallClinic'
import { AppointmentPhone } from 'store/api/types'
import { ClickForActionLink } from 'components'

context('ClickToCallClinic', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  let phoneData = {
    number: '123-456-7890',
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
      component = renderWithProviders(<ClickToCallClinic {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(phoneData)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(ClickForActionLink).length).toEqual(1)
  })

  describe('when the phone prop does not exist', () => {
    it('should not return a ClickForActionLink component', async () => {
      initializeTestInstance()
      expect(testInstance.findAllByType(ClickForActionLink).length).toEqual(0)
    })
  })
})
