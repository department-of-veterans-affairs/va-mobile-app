import React from 'react'

import { context, renderWithProviders } from "testUtils";
import PhaseIndicator from "./PhaseIndicator";
import { act, ReactTestInstance } from "react-test-renderer";
import { Box, TextView, VAIcon } from "components";

context('PhaseIndicator', () => {

  let component: any
  let testInstance: ReactTestInstance

  const initializeTextInstance = (phase:number, current: number) => {
    act(() => {
      component = renderWithProviders(<PhaseIndicator phase={phase} current={current} />)
    })
    testInstance = component.root
  }

  // make sure the component works
  it('initializes correctly', async () => {
    await initializeTextInstance(1,1)
    expect(component).toBeTruthy()
  })

  // make tests to make sure it renders a checkbox
  describe('when phase is less than current', () => {
    beforeEach(() => {
      initializeTextInstance(1, 2)
    })
    it('should render a white check box on a green background', async () => {
      const icon = testInstance.findByType(VAIcon)
      expect(icon).toBeTruthy()
      expect(icon.props.name).toEqual('CheckMark')
      expect(icon.props.fill).toEqual('#fff')
      expect(testInstance.findAllByType(Box)[0].props.backgroundColor).toEqual('completedPhase')
    })
  })

  // make tests to make sure it renders a number with a green background
  describe('when phase is equal to current', () => {
    beforeEach(() => {
      initializeTextInstance(1, 1)
    })
    it('should render a white number on a blue background', async () => {
      const text = testInstance.findAllByType(TextView)[0]
      expect(text).toBeTruthy()
      expect(text.props.children).toEqual(1)
      expect(text.props.color).toEqual('claimPhase')
      expect(testInstance.findAllByType(Box)[0].props.backgroundColor).toEqual('currentPhase')
    })
  })

  // make tests to make sure it renders a number with a gray background
  describe('when phase is greater than current', () => {
    beforeEach(() => {
      initializeTextInstance(2, 1)
    })
    it('should render a number', async () => {
      const text = testInstance.findAllByType(TextView)[0]
      expect(text).toBeTruthy()
      expect(text.props.children).toEqual(2)
      expect(text.props.color).toEqual('claimPhase')
      expect(testInstance.findAllByType(Box)[0].props.backgroundColor).toEqual('upcomingPhase')
    })
  })

})
