import React, { RefObject } from 'react'
import { ScrollView } from 'react-native'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'

import { claim } from '../../../claimData'
import ClaimTimeline from './ClaimTimeline'

context('ClaimTimeline', () => {
  const { attributes, id } = claim

  const initializeTestInstance = (needItemsFromVeteran: boolean) => {
    const events = needItemsFromVeteran
      ? attributes.eventsTimeline
      : attributes.eventsTimeline.filter((it) => it.type !== 'still_need_from_you_list')
    const props = {
      attributes: { ...claim.attributes, eventsTimeline: events },
      claimID: id,
      scrollIsEnabled: false,
      scrollViewRef: {} as RefObject<ScrollView>,
    }

    render(<ClaimTimeline {...props} />)
  }

  it('shows full list of steps', () => {
    initializeTestInstance(false)
    expect(screen.queryByText(t('claimPhase.youHaveFileRequestVA_plural', { count: 2 }))).toBeFalsy()
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
})
