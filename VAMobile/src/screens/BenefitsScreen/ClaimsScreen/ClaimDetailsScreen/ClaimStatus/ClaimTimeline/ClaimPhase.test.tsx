import React, { RefObject } from 'react'
import { ScrollView } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

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
    expect(
      screen.getByLabelText(
        `${t('stepXofY', { current: 1, total: 5 })}. ${t('claimPhase.5step.heading.phase1')}. ${t('currentStep')}.`,
      ),
    ).toBeTruthy()
    expect(screen.getByRole('tab')).toBeTruthy()
  })

  describe('when phase is less than current', () => {
    it('renders correct label and text after press', () => {
      initializeTestInstance(1, 2, true)
      expect(
        screen.getByLabelText(
          `${t('stepXofY', { current: 1, total: 8 })}. ${t('claimPhase.8step.heading.phase1')}. ${t('complete')}.`,
        ),
      ).toBeTruthy()
      fireEvent.press(screen.getAllByRole('tab')[0])
      expect(screen.getByText(t('claimPhase.8step.details.phase1'))).toBeTruthy()
    })
  })

  describe('when phase is equal to current', () => {
    it('renders correct label and text without press', () => {
      initializeTestInstance(2, 2, true)
      expect(
        screen.getByLabelText(
          `${t('stepXofY', { current: 2, total: 8 })}. ${t('claimPhase.5step.heading.phase2')}. ${t('currentStep')}. ${t('claimPhase.heading.a11y.step1Complete')}.`,
        ),
      ).toBeTruthy()
      expect(screen.getByText(t('claimPhase.8step.details.phase2'))).toBeTruthy()
    })
  })

  describe('when phase is equal to current with multiple steps complete', () => {
    it('renders correct label and text without press', () => {
      initializeTestInstance(6, 6, true)
      expect(
        screen.getByLabelText(
          `${t('stepXofY', { current: 6, total: 8 })}. ${t('claimPhase.8step.heading.phase6')}. ${t('currentStep')}. ${t('claimPhase.heading.a11y.stepCompleteRange', { lastStep: 5 })}.`,
        ),
      ).toBeTruthy()
      expect(screen.getByText(t('claimPhase.8step.details.phase6'))).toBeTruthy()
    })
  })

  describe('when phase is greater than current', () => {
    it('renders correct label and text after press', () => {
      initializeTestInstance(8, 7, true)
      expect(
        screen.getByLabelText(
          `${t('stepXofY', { current: 8, total: 8 })}. ${t('claimPhase.8step.heading.phase8')}. ${t('incomplete')}.`,
        ),
      ).toBeTruthy()
      fireEvent.press(screen.getAllByRole('tab')[0])
      expect(screen.getByText(t('claimPhase.8step.details.phase8'))).toBeTruthy()
    })
  })
})
