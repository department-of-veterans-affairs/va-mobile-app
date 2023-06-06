import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock
import { Pressable } from 'react-native'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import SelectionList from './SelectionList'
import { Box, TextView, VAButton } from '../index'
import LoginScreen from '../../screens/auth/LoginScreen'
import SelectionListItem from './SelectionListItem'

context('SelectionList', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (useImage = false) => {
    const listContent = [{ content: <TextView>item 1</TextView> }, { content: <TextView>item 2</TextView> }]

    component = render(<SelectionList items={listContent} />)
    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should have the right number of list items', async () => {
    expect(testInstance.findAllByType(SelectionListItem).length).toBe(2)
  })

  it('should toggle items when pressing select all', async () => {
    const items = testInstance.findAllByType(SelectionListItem)

    expect(items[0].props.isSelected).toBe(false)
    expect(items[1].props.isSelected).toBe(false)

    await waitFor(() => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
    })

    expect(items[0].props.isSelected).toBe(true)
    expect(items[1].props.isSelected).toBe(true)

    await waitFor(() => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
    })

    expect(items[0].props.isSelected).toBe(false)
    expect(items[1].props.isSelected).toBe(false)
  })
})
