import React, { RefObject } from 'react'
import { ScrollView } from 'react-native'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { ClaimType } from 'constants/claims'
import { context, mockNavProps, render } from 'testUtils'

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
    expect(
      screen.getByLabelText(
        `${t('stepXofY', { current: 1, total: 8 })}. ${t('claimPhase.8step.heading.phase1')}. ${t('complete')}.`,
      ),
    ).toBeTruthy()
    expect(
      screen.getByLabelText(
        `${t('stepXofY', { current: 2, total: 8 })}. ${t('claimPhase.8step.heading.phase2')}. ${t('complete')}.`,
      ),
    ).toBeTruthy()
    expect(
      screen.getByLabelText(
        `${t('stepXofY', { current: 3, total: 8 })}. ${t('claimPhase.8step.heading.phase3')}. ${t('currentStep')}. ${t('claimPhase.heading.a11y.stepCompleteRange', { lastStep: 2 })}.`,
      ),
    ).toBeTruthy()
    expect(
      screen.getByLabelText(
        `${t('stepXofY', { current: 4, total: 8 })}. ${t('claimPhase.8step.heading.phase4')}. ${t('incomplete')}.`,
      ),
    ).toBeTruthy()
    expect(
      screen.getByLabelText(
        `${t('stepXofY', { current: 5, total: 8 })}. ${t('claimPhase.8step.heading.phase5')}. ${t('incomplete')}.`,
      ),
    ).toBeTruthy()
    expect(
      screen.getByLabelText(
        `${t('stepXofY', { current: 6, total: 8 })}. ${t('claimPhase.8step.heading.phase6')}. ${t('incomplete')}.`,
      ),
    ).toBeTruthy()
    expect(
      screen.getByLabelText(
        `${t('stepXofY', { current: 7, total: 8 })}. ${t('claimPhase.8step.heading.phase7')}. ${t('incomplete')}.`,
      ),
    ).toBeTruthy()
    expect(
      screen.getByLabelText(
        `${t('stepXofY', { current: 7, total: 8 })}. ${t('claimPhase.8step.heading.phase7')}. ${t('incomplete')}.`,
      ),
    ).toBeTruthy()
  })

  describe('when the claimType is CLOSED', () => {
    it('should display text detailing decision packet information and should display the date for the event in the events timeline where the type is "completed"', () => {
      initializeTestInstance('', 'CLOSED')
      expect(screen.getByText(t('claimDetails.weDecidedMailed', { date: 'January 31, 2019' }))).toBeTruthy()
    })
  })
})
