import 'react-native'
import { Pressable } from 'react-native'
import React from 'react'

import { context, render, RenderAPI } from 'testUtils'
import AccordionCollapsible from './AccordionCollapsible'
import TextView from './TextView'
import { VABorderColors } from 'styles/theme'

context('AccordionCollapsible', () => {
  let component: RenderAPI
  let testInstance: RenderAPI

  const initializeTestInstance = (hideArrow = false, alertBorder = false) => {
    const borderProps = alertBorder ? { alertBorder: 'warning' as keyof VABorderColors } : {}

    component = render(
      <AccordionCollapsible
        {...borderProps}
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
      expect(testInstance.container.findAllByType(Pressable).length).toEqual(1)
    })
  })

  describe('when hideArrow is true', () => {
    it('should not render a Pressable', async () => {
      initializeTestInstance(true)
      expect(testInstance.container.findAllByType(Pressable).length).toEqual(0)
    })
  })

  describe('when expanded is true', () => {
    it('should render the expandedContent', async () => {
      testInstance.container.findByType(Pressable).props.onPress()

      expect(testInstance.container.findAllByType(TextView)[1].props.children).toEqual('EXPANDED')
    })
  })

  describe('when expanded is false', () => {
    it('should render the collapsedContent', async () => {
      expect(testInstance.container.findAllByType(TextView)[1].props.children).toEqual('COLLAPSED')
    })
  })

  describe('when an alert border is set', () => {
    it('it should have a border', async () => {
      initializeTestInstance(false, true)
      const wrapperBox = await testInstance.findByTestId('accordion-wrapper')
      expect(wrapperBox.props.borderLeftColor).toBe('warning')
    })
  })

  describe('when an alert border is not set', () => {
    it('it should not have a border', async () => {
      const wrapperBox = await testInstance.findByTestId('accordion-wrapper')
      expect(wrapperBox.props.borderLeftColor).toBeFalsy()
    })
  })
})
