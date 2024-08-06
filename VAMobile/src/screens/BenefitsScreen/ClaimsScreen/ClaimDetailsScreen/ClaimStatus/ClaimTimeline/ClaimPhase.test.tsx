import React, { RefObject } from 'react'
import { ScrollView } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

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

jest.mock('utils/remoteConfig')
when(featureEnabled).calledWith('claimPhaseExpansion').mockReturnValue(true)

context('ClaimPhase', () => {
  const initializeTestInstance = (phase: number, current: number) => {
    const props: ClaimPhaseProps = {
      phase,
      attributes: { ...claim.attributes, phase: current },
      claimID: claim.id,
      scrollViewRef: {} as RefObject<ScrollView>,
    }

    render(<ClaimPhase {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance(1, 1)
    expect(screen.getByLabelText('Step 1. Claim received. Current step.')).toBeTruthy()
    expect(screen.getByRole('tab')).toBeTruthy()
  })

  describe('when phase is less than current', () => {
    it('renders correct label and text after press', () => {
      initializeTestInstance(1, 2)
      expect(screen.getByLabelText('Step 1. Claim received. Complete.')).toBeTruthy()
      fireEvent.press(screen.getAllByRole('tab')[0])
      expect(screen.getByText('We received your claim in our system.')).toBeTruthy()
    })
  })

  describe('when phase is equal to current', () => {
    it('renders correct label and text without press', () => {
      initializeTestInstance(2, 2)
      expect(screen.getByLabelText('Step 2. Initial review. Current step. Step 1 complete.')).toBeTruthy()
      expect(
        screen.getByText(
          "We'll check your claim for basic information we need, like your name and Social Security number.\n\nIf information is missing, we'll contact you.",
        ),
      ).toBeTruthy()
    })
  })

  describe('when phase is equal to current with multiple steps complete', () => {
    it('renders correct label and text without press', () => {
      initializeTestInstance(6, 6)
      expect(
        screen.getByLabelText('Step 6. Preparing decision letter. Current step. Step 1 through 5 complete.'),
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
      initializeTestInstance(8, 7)
      expect(screen.getByLabelText('Step 8. Claim decided. Incomplete.')).toBeTruthy()
      fireEvent.press(screen.getAllByRole('tab')[0])
      expect(
        screen.getByText("You’ll be able to view and download your decision letter. We'll also mail you this letter."),
      ).toBeTruthy()
    })
  })
})
