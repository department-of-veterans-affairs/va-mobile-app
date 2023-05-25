import 'react-native'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import HowToUpdateDirectDepositScreen from './HowToUpdateDirectDepositScreen'

context('HowToUpdateDirectDepositScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<HowToUpdateDirectDepositScreen {...mockNavProps()} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
