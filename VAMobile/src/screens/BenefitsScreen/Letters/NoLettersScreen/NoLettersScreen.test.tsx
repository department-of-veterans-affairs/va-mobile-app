import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, render, RenderAPI } from 'testUtils'
import NoLettersScreen from './NoLettersScreen'

context('NoLettersScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<NoLettersScreen />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
