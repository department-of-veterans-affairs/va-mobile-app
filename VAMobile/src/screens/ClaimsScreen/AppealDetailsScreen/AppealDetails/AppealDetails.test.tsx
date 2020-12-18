import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, renderWithProviders } from 'testUtils'

import AppealDetails from './AppealDetails'

context('AppealDetails', () => {
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    props = mockNavProps()

    act(() => {
      component = renderWithProviders(<AppealDetails {...props} />)
    })

    testInstance = component.root
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })
})
