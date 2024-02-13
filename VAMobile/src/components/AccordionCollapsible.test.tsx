import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import AccordionCollapsible from './AccordionCollapsible'
import TextView from './TextView'

import Mock = jest.Mock

context('AccordionCollapsible', () => {
  let onPressSpy: Mock
  const initializeTestInstance = (hideArrow = false, expandedInitialValue = false) => {
    onPressSpy = jest.fn(() => {})
    render(
      <AccordionCollapsible
        hideArrow={hideArrow}
        header={<TextView>HEADER</TextView>}
        expandedContent={<TextView>EXPANDED</TextView>}
        collapsedContent={<TextView>COLLAPSED</TextView>}
        customOnPress={onPressSpy}
        expandedInitialValue={expandedInitialValue}>
        <TextView>Child</TextView>{' '}
      </AccordionCollapsible>,
    )
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('should render correctly', () => {
    it('when it is setup as default', () => {
      expect(screen.getByRole('tab', { name: 'HEADER' })).toBeTruthy()
      expect(screen.queryByText('EXPANDED')).toBeFalsy()
      expect(screen.getByText('COLLAPSED')).toBeTruthy()
      expect(screen.getByText('Child')).toBeTruthy()
    })

    it('when pressed should display the expanded content and hide the collapsed and calls custom on press', () => {
      fireEvent.press(screen.getByRole('tab'))
      expect(screen.getByText('EXPANDED')).toBeTruthy()
      expect(screen.queryByText('COLLAPSED')).toBeFalsy()
      expect(onPressSpy).toBeCalled()
    })

    it('when hideArrow set to true, cannot find tab to press', () => {
      initializeTestInstance(true)
      expect(screen.queryByRole('tab')).toBeFalsy()
    })

    it('when expandedIntiailValue is true it should show Expanded and not Collapsed content on load', () => {
      initializeTestInstance(false, true)
      expect(screen.getByRole('tab', { name: 'HEADER' })).toBeTruthy()
      expect(screen.queryByText('COLLAPSED')).toBeFalsy()
      expect(screen.getByText('EXPANDED')).toBeTruthy()
      expect(screen.getByText('Child')).toBeTruthy()
    })
  })
})
