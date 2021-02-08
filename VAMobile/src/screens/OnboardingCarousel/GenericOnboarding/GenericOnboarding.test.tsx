import 'react-native'
import React from 'react'
import 'jest-styled-components'
import {act, ReactTestInstance} from 'react-test-renderer'

import {context, renderWithProviders} from 'testUtils'
import GenericOnboarding from './GenericOnboarding'

context('GenericOnboarding', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    act(() => {
      component = renderWithProviders(<GenericOnboarding header={'header'} text={'text'} testID={'testID'}/>)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
