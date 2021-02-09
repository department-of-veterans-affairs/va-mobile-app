import 'react-native'
import React from 'react'
import 'jest-styled-components'
import {act, ReactTestInstance} from 'react-test-renderer'

import {context, renderWithProviders} from 'testUtils'
import GenericOnboarding from './GenericOnboarding'
import {VAIcon} from 'components'

context('GenericOnboarding', () => {
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (displayLogo: boolean = false) => {
    act(() => {
      component = renderWithProviders(<GenericOnboarding header={'header'} text={'text'} testID={'testID'} displayLogo={displayLogo}/>)
    })

    testInstance = component.root
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
