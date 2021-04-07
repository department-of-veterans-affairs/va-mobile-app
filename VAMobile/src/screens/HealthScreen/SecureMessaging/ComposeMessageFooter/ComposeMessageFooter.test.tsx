import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders} from 'testUtils'
import ComposeMessageFooter from './ComposeMessageFooter'

context('ComposeMessageFooter', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    act(() => {
      component = renderWithProviders(<ComposeMessageFooter/>)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
