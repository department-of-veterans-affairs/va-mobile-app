import 'react-native'
import React from 'react'
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import GenericOnboarding from './GenericOnboarding'
import { VAIcon } from 'components'

context('GenericOnboarding', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (displayLogo: boolean = false) => {
    component = render(<GenericOnboarding header={'header'} text={'text'} displayLogo={displayLogo} />)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when displayLogo is true', () => {
    it('should display a VAIcon', async () => {
      initializeTestInstance(true)
      expect(testInstance.findAllByType(VAIcon).length).toEqual(1)
    })
  })
})
