import 'react-native'
import { Pressable } from 'react-native'
import React from 'react'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import AccordionCollapsible from './AccordionCollapsible'
import TextView from './TextView'

context('AccordionCollapsible', () => {
  let component: RenderAPI
  let testInstance: RenderAPI

  const initializeTestInstance = (hideArrow = false) => {
    component = render(
      <AccordionCollapsible
        hideArrow={hideArrow}
        header={<TextView>HEADER</TextView>}
        expandedContent={<TextView>EXPANDED</TextView>}
        collapsedContent={<TextView>COLLAPSED</TextView>}
      />,
    )

    testInstance = component
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when hideArrow is false', () => {
    it('should render a Pressable', async () => {
      expect(testInstance.UNSAFE_root.findAllByType(Pressable).length).toEqual(1)
    })
  })

  describe('when hideArrow is true', () => {
    it('should not render a Pressable', async () => {
      initializeTestInstance(true)
      expect(testInstance.UNSAFE_root.findAllByType(Pressable).length).toEqual(0)
    })
  })

  describe('when expanded is true', () => {
    it('should render the expandedContent', async () => {
      await waitFor(() => {
        testInstance.UNSAFE_root.findByType(Pressable).props.onPress()

        expect(testInstance.UNSAFE_root.findAllByType(TextView)[1].props.children).toEqual('EXPANDED')
      })
    })
  })

  describe('when expanded is false', () => {
    it('should render the collapsedContent', async () => {
      expect(testInstance.UNSAFE_root.findAllByType(TextView)[1].props.children).toEqual('COLLAPSED')
    })
  })
})
