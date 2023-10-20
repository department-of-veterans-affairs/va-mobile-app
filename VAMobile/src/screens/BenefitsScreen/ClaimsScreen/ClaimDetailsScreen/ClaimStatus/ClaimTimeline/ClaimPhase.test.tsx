import React from 'react'

import { context, render, RenderAPI } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'
import { claim } from '../../../claimData'
import ClaimPhase from './ClaimPhase'
import PhaseIndicator from './PhaseIndicator'
import { TextView, VAButton, VAIcon } from 'components'
import { Pressable } from 'react-native'
import { waitFor } from '@testing-library/react-native'
import { when } from 'jest-when'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('ClaimPhase', () => {
  let props: any
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let mockNavigateToClaimFileUploadSpy: jest.Mock

  const initializeTestInstance = (phase: number, current: number) => {
    mockNavigateToClaimFileUploadSpy = jest.fn()
    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('FileRequest', { claimID: undefined })
      .mockReturnValue(mockNavigateToClaimFileUploadSpy)
    props = {
      phase,
      current,
      attributes: claim.attributes,
    }

    component = render(<ClaimPhase {...props} />)

    testInstance = component.UNSAFE_root
  }

  // make sure the component works
  it('initializes correctly', async () => {
    initializeTestInstance(1, 1)
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(PhaseIndicator).length).toEqual(1)
  })

  // make sure it has the expandable arrow and that it works
  describe('when phase is less than current', () => {
    beforeEach(() => {
      initializeTestInstance(1, 2)
    })

    it('should render with an icon', async () => {
      const icon = testInstance.findAllByType(VAIcon)[1]
      expect(icon).toBeTruthy()
      expect(icon.props.name).toEqual('ChevronDown')
    })

    // TODO: need a way to test component state. So far jest + enzyme doesnt seem the work in RN

    it('should render text details after pressing icon', async () => {
      await waitFor(() => {
        const icon = testInstance.findAllByType(VAIcon)[1]
        const pressable = testInstance.findByType(Pressable)
        pressable.props.onPress()
        expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('June 6, 2019')
        expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Thank you. VA received your claim')
        expect(icon.props.name).toEqual('ChevronUp')
      })
    })
  })

  describe('when phase is equal to current', () => {
    beforeEach(() => {
      initializeTestInstance(2, 2)
    })

    it('should render with an chevron icon', async () => {
      const icon = testInstance.findAllByType(VAIcon)[0]
      expect(icon).toBeTruthy()
      expect(icon.props.name).toEqual('ChevronDown')
    })

    it('should render text details after pressing icon', async () => {
      await waitFor(() => {
        const icon = testInstance.findAllByType(VAIcon)[0]
        const pressable = testInstance.findByType(Pressable)
        pressable.props.onPress()
        expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('June 6, 2019')
        expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Your claim has been assigned to a reviewer who is determining if additional information is needed.')
        expect(icon.props.name).toEqual('ChevronUp')
      })
    })
  })

  describe('when phase is greater than current', () => {
    beforeEach(() => {
      initializeTestInstance(4, 2)
    })

    it('should not render with an arrow icon', async () => {
      const icon = testInstance.findAllByType(VAIcon)[0]
      expect(icon).toBeFalsy()
    })

    it('should not render text details', async () => {
      expect(testInstance.findAllByType(TextView)[2]).toBeFalsy()
      expect(testInstance.findAllByType(TextView)[3]).toBeFalsy()
    })
  })

  describe('when phase is 3', () => {
    describe('if there are files that can be uploaded', () => {
      let buttons: ReactTestInstance[]
      beforeEach(async () => {
        claim.attributes.decisionLetterSent = false
        claim.attributes.open = true
        claim.attributes.documentsNeeded = true
        claim.attributes.eventsTimeline = [
          {
            type: 'still_need_from_you_list',
            date: '2020-07-16',
            status: 'NEEDED',
            uploaded: false,
            uploadsAllowed: true,
          },
          {
            type: 'still_need_from_you_list',
            date: '2020-07-16',
            status: 'NEEDED',
            uploaded: false,
            uploadsAllowed: true,
          },
        ]
        initializeTestInstance(3, 2)

        buttons = testInstance.findAllByType(VAButton)
      })

      it('should display the view file requests va button', async () => {
        expect(buttons.length).toEqual(1)
        expect(buttons[0].props.label).toEqual('Review file requests')
      })

      describe('on click of the file request button', () => {
        it('should call useRouteNavigation', async () => {
          buttons[0].props.onPress()
          expect(mockNavigateToClaimFileUploadSpy).toHaveBeenCalled()
        })
      })

      describe('when number of requests is greater than 1', () => {
        it('should display the text "You have {{number}} file requests from VA"', async () => {
          expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('You have 2 file requests from VA')
        })
      })

      describe('when number of requests is equal to 1', () => {
        it('should display the text "You have 1 file request from VA"', async () => {
          claim.attributes.eventsTimeline = [
            {
              type: 'still_need_from_you_list',
              date: '2020-07-16',
              status: 'NEEDED',
              uploaded: false,
              uploadsAllowed: true,
            },
          ]
          initializeTestInstance(3, 2)

          expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('You have 1 file request from VA')
        })
      })
    })
  })
})
