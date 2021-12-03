import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders} from 'testUtils'
import CollapsibleView from './CollapsibleView'
import TextView from './TextView'
import { Pressable } from 'react-native'

context('CollapsibleView', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    act(() => {
      component = renderWithProviders(<CollapsibleView text={'Where can I find these numbers?'} children={<TextView>Revealed text</TextView>}/>)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the dropdown is pressed once', () => {
    it('should show the children content', async () => {
      act(() => {
        testInstance.findByType(Pressable).props.onPress()
      })

      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(2)
      const expandedContent = textViews[1]
      expect(expandedContent.props.children).toEqual('Revealed text')
    })
  })

  describe('when the dropdown is pressed twice', () => {
    it('should hide the children content since the dropdown was opened and then closed', async () => {
      const touchable = testInstance.findByType(Pressable)
      act(() => {
        touchable.props.onPress()
      })

      act(() => {
        touchable.props.onPress()
      })

      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(1)
    })
  })
})
