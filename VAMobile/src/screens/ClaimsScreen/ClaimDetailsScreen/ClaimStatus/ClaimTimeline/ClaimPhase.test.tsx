import React from 'react'

import { context, renderWithProviders } from "testUtils";
import { act, ReactTestInstance } from "react-test-renderer";
import { claim } from '../../../claimData'
import ClaimPhase from "./ClaimPhase";
import PhaseIndicator from "./PhaseIndicator";
import { TextView, VAIcon } from "../../../../../components";
import { Pressable } from "react-native";

context('ClaimPhase', () => {
  let props: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = ( phase: number, current: number ) => {
    props = {
      phase,
      current,
      attributes: claim.attributes
    }

    act(() => {
      component = renderWithProviders(<ClaimPhase {...props} />)
    })

    testInstance = component.root
  }

  // make sure the component works
  it('initializes correctly', async () => {
    await initializeTestInstance(1,1)
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(PhaseIndicator).length).toEqual(1)
  })

  // make sure it has the expandable arrow and that it works
  describe('when phase is less than current', () => {
    beforeEach(() => {
      initializeTestInstance(1, 2)
    })

    it('should render with an icon',  async () => {
      const icon = testInstance.findAllByType(VAIcon)[1]
      expect(icon).toBeTruthy()
      expect(icon.props.name).toEqual('ArrowDown')
    })

    // TODO: need a way to test component state. So far jest + enzyme doesnt seem the work in RN

    it('should render text details after pressing icon',  async () => {
      const icon = testInstance.findAllByType(VAIcon)[1]
      const pressable = testInstance.findByType(Pressable)
      pressable.props.onPress()
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('June 6, 2019')
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Thank you. VA received your claim')
      expect(icon.props.name).toEqual('ArrowUp')
    })

  })

  describe('when phase is equal to current', () => {
    beforeEach(() => {
      initializeTestInstance(2, 2)
    })

    it('should render with an arrow icon',  async () => {
      const icon = testInstance.findAllByType(VAIcon)[0]
      expect(icon).toBeTruthy()
      expect(icon.props.name).toEqual('ArrowDown')
    })


    it('should render text details after pressing icon',  async () => {
      const icon = testInstance.findAllByType(VAIcon)[0]
      const pressable = testInstance.findByType(Pressable)
      pressable.props.onPress()
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('June 6, 2019')
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Your claim has been assigned to a reviewer who is determining if additional information is needed.')
      expect(icon.props.name).toEqual('ArrowUp')
    })

  })

  describe('when phase is greater than current', () => {
    beforeEach(() => {
      initializeTestInstance(4, 2)
    })

    it('should not render with an arrow icon',  async () => {
      const icon = testInstance.findAllByType(VAIcon)[0]
      expect(icon).toBeFalsy()
    })


    it('should not render text details',  async () => {
      expect(testInstance.findAllByType(TextView)[2]).toBeFalsy()
      expect(testInstance.findAllByType(TextView)[3]).toBeFalsy()
    })

  })

})
