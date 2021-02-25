import 'react-native'
import { Linking } from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'

import { TestProviders, context, findByTestID } from 'testUtils'
import HomeScreen from './index'

context('HomeScreen', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = renderer.create(
      <TestProviders>
        <HomeScreen />
      </TestProviders>,
    )

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    await act(async () => {
      expect(component).toBeTruthy()
    })
  })

  describe('when the covid 19 screening tool button is clicked', () => {
    it('should call Linking openUrl with the parameter https://www.va.gov/covid19screen/', async () => {
      // accessing parent Pressable component from nested Box component
      findByTestID(testInstance, 'covid-19-screening-tool').parent?.parent?.parent?.props?.onPress()
      expect(Linking.openURL).toHaveBeenCalledWith('https://www.va.gov/covid19screen/')
    })
  })
})
