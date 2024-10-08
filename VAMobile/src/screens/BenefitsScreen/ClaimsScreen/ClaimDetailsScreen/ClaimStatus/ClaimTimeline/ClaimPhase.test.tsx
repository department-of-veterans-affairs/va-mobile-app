import React, { RefObject } from 'react'
import { ScrollView } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import { claim } from '../../../claimData'
import ClaimPhase, { ClaimPhaseProps } from './ClaimPhase'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('ClaimPhase', () => {
  const initializeTestInstance = (phase: number, current: number, isDisabilityClaim: boolean) => {
    const claimTypeCode = isDisabilityClaim ? '010LCOMP' : '290AUTOIDES'
    const props: ClaimPhaseProps = {
      phase,
      attributes: { ...claim.attributes, phase: current, claimTypeCode },
      claimID: claim.id,
      scrollIsEnabled: false,
      scrollViewRef: {} as RefObject<ScrollView>,
    }

    render(<ClaimPhase {...props} />)
  }

  it('initializes 5-step claim correctly', () => {
    initializeTestInstance(1, 1, false)
    expect(screen.getByLabelText('Step 1 of 5. Claim received. Current step.')).toBeTruthy()
    expect(screen.getByRole('tab')).toBeTruthy()
  })

  describe('when phase is less than current', () => {
    it('renders correct label and text after press', () => {
      initializeTestInstance(1, 2, true)
      expect(screen.getByLabelText('Step 1 of 8. Claim received. Complete.')).toBeTruthy()
      fireEvent.press(screen.getAllByRole('tab')[0])
      expect(screen.getByText('We received your claim in our system.')).toBeTruthy()
    })
  })

  describe('when phase is equal to current', () => {
    it('renders correct label and text without press', () => {
      initializeTestInstance(2, 2, true)
      expect(screen.getByLabelText('Step 2 of 8. Initial review. Current step. Step 1 complete.')).toBeTruthy()
      expect(
        screen.getByText(
          "We'll check your claim for basic information we need, like your name and Social Security number.\n\nIf information is missing, we'll contact you.",
        ),
      ).toBeTruthy()
    })
  })

  describe('when phase is equal to current with multiple steps complete', () => {
    it('renders correct label and text without press', () => {
      initializeTestInstance(6, 6, true)
      expect(
        screen.getByLabelText('Step 6 of 8. Preparing decision letter. Current step. Step 1 through 5 complete.'),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'We’ll prepare your decision letter.\n\nIf we need more evidence or you submit more evidence, your claim will go back to Step 3.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when phase is greater than current', () => {
    it('renders correct label and text after press', () => {
      initializeTestInstance(8, 7, true)
      expect(screen.getByLabelText('Step 8 of 8. Claim decided. Incomplete.')).toBeTruthy()
      fireEvent.press(screen.getAllByRole('tab')[0])
      expect(
        screen.getByText("You’ll be able to view and download your decision letter. We'll also mail you this letter."),
      ).toBeTruthy()
    })
  })
})
