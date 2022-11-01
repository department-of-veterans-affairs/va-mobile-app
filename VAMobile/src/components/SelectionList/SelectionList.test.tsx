import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import {ReactTestInstance} from 'react-test-renderer'
import Mock = jest.Mock
import { Pressable } from 'react-native'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import SelectionList from './SelectionList'
import {Box, TextView, VAButton} from "../index";
import LoginScreen from "../../screens/auth/LoginScreen";
import SelectionListItem from "./SelectionListItem";


jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  let theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
  }
})

context('SelectionList', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (useImage = false) => {
    const listContent = [{ content: <TextView>item 1</TextView> }, { content:<TextView>item 2</TextView> }]

    component = render(<SelectionList items={listContent} />)
    testInstance = component.container
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
