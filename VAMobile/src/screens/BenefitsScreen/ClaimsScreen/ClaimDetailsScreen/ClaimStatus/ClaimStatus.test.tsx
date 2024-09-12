import React, { RefObject } from 'react'
import { ScrollView } from 'react-native'

import { screen } from '@testing-library/react-native'

import { ClaimType } from 'constants/claims'
import { context, mockNavProps, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

import { claim } from '../../claimData'
import ClaimStatus from './ClaimStatus'

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

context('ClaimStatus', () => {
  const defaultMaxEstDate = '2019-12-11'
  const initializeTestInstance = (maxEstDate: string, claimType: ClaimType): void => {
    const props = mockNavProps({
      claim: { ...claim, attributes: { ...claim.attributes, maxEstDate: maxEstDate } },
      claimType,
      scrollIsEnabled: false,
      scrollViewRef: {} as RefObject<ScrollView>,
    })
    render(<ClaimStatus {...props} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    initializeTestInstance(defaultMaxEstDate, 'ACTIVE')
  })

  it('Renders ClaimStatus', () => {
    expect(screen.getByLabelText('Step 1 of 8. Claim received. Complete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 2 of 8. Initial review. Complete.')).toBeTruthy()
    expect(
      screen.getByLabelText('Step 3 of 8. Evidence gathering. Current step. Step 1 through 2 complete.'),
    ).toBeTruthy()
    expect(screen.getByLabelText('Step 4 of 8. Evidence review. Incomplete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 5 of 8. Rating. Incomplete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 6 of 8. Preparing decision letter. Incomplete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 7 of 8. Final review. Incomplete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 8 of 8. Claim decided. Incomplete.')).toBeTruthy()
  })

  describe('when the claimType is CLOSED', () => {
    it('should display text detailing decision packet information and should display the date for the event in the events timeline where the type is "completed"', () => {
      initializeTestInstance('', 'CLOSED')
      expect(
        screen.getByText(
          'We decided your claim on January 31, 2019. We mailed you a decision letter. It should arrive within 10 days after the date we decided your claim. It can sometimes take longer.',
        ),
      ).toBeTruthy()
    })
  })
})
