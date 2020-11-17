import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import {context, renderWithProviders} from 'testUtils'
import NoLettersScreen from './NoLettersScreen'

context('NoLettersScreen', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {

    act(() => {
      component = renderWithProviders(<NoLettersScreen />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
