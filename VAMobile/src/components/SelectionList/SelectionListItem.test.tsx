import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock
import { Pressable } from 'react-native'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import SelectionListItem from './SelectionListItem'

context('SelectionListItem', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onSelectSpy: Mock

  const initializeTestInstance = (useImage = false) => {
    onSelectSpy = jest.fn(() => {})

    component = render(<SelectionListItem isSelected={false} setSelectedFn={onSelectSpy} />)
    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call the alert when the button is pressed', async () => {
    await waitFor(() => {
      testInstance.findByType(Pressable).props.onPress()
      expect(onSelectSpy).toBeCalled()
    })
  })
})
