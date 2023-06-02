import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { Pressable } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock

import { context, render, RenderAPI, waitFor } from 'testUtils'
import PhotoAdd from 'components/PhotoAdd'

context('PhotoAdd', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    component = render(<PhotoAdd width={110} height={110} onPress={onPressSpy} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the PhotoAdd is clicked', () => {
    it('should call the onPress function', async () => {
      await waitFor(() => {
        testInstance.findByType(Pressable).props.onPress()
        expect(onPressSpy).toBeCalled()
      })
    })
  })
})
