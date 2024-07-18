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
      current,
      attributes: claim.attributes,
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
    it('should render text details after pressing icon', () => {
      initializeTestInstance(1, 2)
      fireEvent.press(screen.getAllByRole('tab')[0])
      expect(screen.getByText('We received your claim in our system.')).toBeTruthy()
    })
  })

  describe('when phase is equal to current', () => {
    it('should render text details after pressing icon', () => {
      initializeTestInstance(2, 2)
      expect(
        screen.getByText(
          "We'll check your claim for basic information we need, like your name and Social Security number.\n\nIf information is missing, we'll contact you.",
        ),
      ).toBeTruthy()
    })
  })
})
