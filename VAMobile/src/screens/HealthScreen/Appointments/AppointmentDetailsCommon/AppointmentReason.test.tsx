import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders, findByTypeWithSubstring } from 'testUtils'

import { InitialState } from 'store/reducers'
import { TextView } from 'components'
import AppointmentReason from './AppointmentReason'

context('AppointmentTypeAndDate', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance
  let reasonText = 'New Issue: 22.4.55'

  const initializeTestInstance = (reason: string | null): void => {
    props = mockNavProps({
      reason: reason,
    })

    store = mockStore({
      ...InitialState,
    })

    act(() => {
      component = renderWithProviders(<AppointmentReason {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(reasonText)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when reason exists', () => {
    it('should render a TextView with the reason text', async () => {
      const texts = testInstance.findAllByType(TextView)
      expect(texts[0].props.children).toBe('You shared these details about your concern')
      expect(texts[1].props.children).toBe(reasonText)
    })
  })

  describe('when reason does not exists', () => {
    it('should not render text', async () => {
      initializeTestInstance(null)
      expect(testInstance.findAllByType(TextView).length).toEqual(0)
    })
  })
})
