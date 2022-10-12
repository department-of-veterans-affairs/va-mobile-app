import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import {ReactTestInstance} from 'react-test-renderer'
import Mock = jest.Mock
import { Pressable } from 'react-native'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import SelectionListItem from './SelectionListItem'


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

context('SelectionListItem', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onSelectSpy: Mock

  const initializeTestInstance = (useImage = false) => {
    onSelectSpy = jest.fn(() => {})

    component = render(<SelectionListItem isSelected={false} setSelectedFn={onSelectSpy} />)
    testInstance = component.container
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
