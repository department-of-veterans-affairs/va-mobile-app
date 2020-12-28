import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders } from 'testUtils'
import VABulletList from './VABulletList'

context('VABulletList', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {

    act(() => {
      component = renderWithProviders(<VABulletList listOfText={['first line', 'second line']} />)
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
