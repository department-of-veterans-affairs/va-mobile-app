import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import CollapsibleView from './CollapsibleView'
import TextView from './TextView'
import { Pressable } from 'react-native'

context('CollapsibleView', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<CollapsibleView text={'Where can I find these numbers?'} children={<TextView>Revealed text</TextView>} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the dropdown is pressed once', () => {
    it('should show the children content', async () => {
      await waitFor(() => {
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
      await waitFor(() => {
        touchable.props.onPress()
      })

      await waitFor(() => {
        touchable.props.onPress()
      })

      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(1)
    })
  })
})
