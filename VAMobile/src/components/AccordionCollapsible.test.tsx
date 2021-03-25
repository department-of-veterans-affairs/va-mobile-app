import 'react-native'
import {Pressable} from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, renderWithProviders} from 'testUtils'
import AccordionCollapsible from './AccordionCollapsible'
import TextView from './TextView'

context('AccordionCollapsible', () => {
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (hideArrow = false) => {
    act(() => {
      component = renderWithProviders(
        <AccordionCollapsible hideArrow={hideArrow} header={<TextView>HEADER</TextView>} expandedContent={<TextView>EXPANDED</TextView>} collapsedContent={<TextView>COLLAPSED</TextView>} />
      )
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when hideArrow is false', () => {
    it('should render a Pressable', async () => {
      expect(testInstance.findAllByType(Pressable).length).toEqual(1)
    })
  })

  describe('when hideArrow is true', () => {
    it('should not render a Pressable', async () => {
      initializeTestInstance(true)
      expect(testInstance.findAllByType(Pressable).length).toEqual(0)
    })
  })

  describe('when expanded is true', () => {
    it('should render the expandedContent', async () => {
      act(() => {
        testInstance.findByType(Pressable).props.onPress()
      })

      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('EXPANDED')
    })
  })

  describe('when expanded is true', () => {
    it('should render the expandedContent', async () => {
      act(() => {
        testInstance.findByType(Pressable).props.onPress()
      })

      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('EXPANDED')
    })
  })

  describe('when expanded is false', () => {
    it('should render the collapsedContent', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('COLLAPSED')
    })
  })
})
