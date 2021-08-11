import 'react-native'
import React from 'react'
import 'jest-styled-components'
import {act, ReactTestInstance} from 'react-test-renderer'

import {context, renderWithProviders} from 'testUtils'
import GenericOnboarding from './GenericOnboarding'
import {VAIcon, VAImageProps, VA_ICON_MAP} from 'components'

context('GenericOnboarding', () => {
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (iconToDisplay: keyof typeof VA_ICON_MAP) => {
    act(() => {
      component = renderWithProviders(<GenericOnboarding header={'header'} text={'text'} testID={'testID'}  iconToDisplay={iconToDisplay}/>)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance('Logo')
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when displayLogo is true', () => {
    it('should display a VAIcon', async () => {
      expect(testInstance.findAllByType(VAIcon).length).toEqual(1)
    })
  })
})
