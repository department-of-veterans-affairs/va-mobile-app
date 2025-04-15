import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { AppealAOJTypes, AppealStatusData, AppealTypes } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'

import AppealCurrentStatus from './AppealCurrentStatus'

const mockExternalLinkSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('AppealStatus', () => {
  const status: AppealStatusData = {
    details: {},
    type: 'scheduled_hearing',
  }

  const initializeTestInstance = (
    providedStatus: AppealStatusData,
    aoj: AppealAOJTypes,
    appealType: AppealTypes,
    docketName: string,
    programArea: string,
  ) => {
    const props = mockNavProps({
      status: providedStatus,
      aoj,
      appealType,
      docketName,
      programArea,
    })

    render(<AppealCurrentStatus {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
  })

  it('should initialize', () => {
    expect(screen.getByRole('header', { name: t('appealDetails.currentStatus') })).toBeTruthy()
    expect(screen.getByRole('header', { name: t('appealDetails.scheduledHearingTitle') })).toBeTruthy()
    expect(screen.getByText('Your  hearing is scheduled for  at .')).toBeTruthy()
  })

  describe('when the status type is scheduled_hearing', () => {
    describe('when the appealType is appeal', () => {
      it('should display the note text', () => {
        initializeTestInstance(status, 'vba', 'appeal', '', 'compensation')
        expect(
          screen.getByText(
            t('appealDetails.hlrReceivedDescription2') + t('appealDetails.scheduledHearingDescription2'),
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('when the status type is pending_hearing_scheduling', () => {
    beforeEach(() => {
      status.type = 'pending_hearing_scheduling'
    })

    it('should display the pending_hearing_scheduling data', () => {
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.pendingHearingSchedulingTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.pendingHearingSchedulingDescription1', { hearingType: '' })),
      ).toBeTruthy()
    })

    describe('when the appealType is appeal', () => {
      it('should display the note text', () => {
        initializeTestInstance(status, 'vba', 'appeal', '', 'compensation')
        expect(screen.getByRole('header', { name: t('appealDetails.pendingHearingSchedulingTitle') })).toBeTruthy()
        expect(
          screen.getByText(t('appealDetails.pendingHearingSchedulingDescription1', { hearingType: '' })),
        ).toBeTruthy()
        expect(
          screen.getByText(
            t('appealDetails.hlrReceivedDescription2') + t('appealDetails.scheduledHearingDescription2'),
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('when the status type is on_docket', () => {
    beforeEach(() => {
      status.type = 'on_docket'
    })

    it('should display the on_docket data', () => {
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByText(t('appealDetails.onDocketTitle'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.onDocketDescription1'))).toBeTruthy()
    })

    describe('when the appealType is appeal', () => {
      it('should display the note text', () => {
        initializeTestInstance(status, 'vba', 'appeal', '', 'compensation')
        expect(screen.getByRole('header', { name: t('appealDetails.onDocketTitle') })).toBeTruthy()
        expect(screen.getByText(t('appealDetails.onDocketDescription1'))).toBeTruthy()
        expect(
          screen.getByText(t('appealDetails.hlrReceivedDescription2') + t('appealDetails.onDocketDescription2')),
        ).toBeTruthy()
      })
    })
  })

  describe('when the status type is pending_certification_ssoc', () => {
    it('should display the pending_certification_ssoc data', () => {
      status.type = 'pending_certification_ssoc'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.pendingCertSsocTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.pendingCertSsocDescription1', { aojDesc: t('appealDetails.vba'), date: '' })),
      ).toBeTruthy()
      expect(screen.getByText(t('appealDetails.pendingCertSsocDescription2'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.pendingCertSsocDescription3'))).toBeTruthy()
    })
  })

  describe('when the status type is pending_certification', () => {
    it('should display the pending_certification data', () => {
      status.type = 'pending_certification'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByText(t('appealDetails.pendingCertTitle'))).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.pendingCertDescription', { aojDesc: t('appealDetails.vba') })),
      ).toBeTruthy()
    })
  })

  describe('when the status type is pending_form9', () => {
    it('should display the pending_form9 data', () => {
      status.type = 'pending_form9'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.pendingForm9Title') })).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.pendingForm9Description1', { aojDesc: t('appealDetails.vba'), date: '' })),
      ).toBeTruthy()
      expect(screen.getByText(t('appealDetails.pendingForm9Description2'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.pendingForm9Description3') + t('appealDetails.or'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.pendingForm9Description4'))).toBeTruthy()
    })
  })

  describe('when the status type is pending_soc', () => {
    beforeEach(() => {
      status.type = 'pending_soc'
    })

    it('should display the pending_soc data', () => {
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.pendingSocTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.pendingSocDescription', { aojDesc: t('appealDetails.vba') })),
      ).toBeTruthy()
    })

    describe('when aoj is other', () => {
      it('should display the aoj description as Agency of Original Jurisdiction', () => {
        initializeTestInstance(status, 'other', 'higherLevelReview', '', 'compensation')
        expect(screen.getByRole('header', { name: t('appealDetails.pendingSocTitle') })).toBeTruthy()
        expect(
          screen.getByText(
            t('appealDetails.pendingSocDescription', { aojDesc: t('appealDetails.agencyJurisdiction') }),
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('when the status type is stayed', () => {
    it('should display the stayed data', () => {
      status.type = 'stayed'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.stayedTitle') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.stayedDescription'))).toBeTruthy()
    })
  })

  describe('when the status type is at_vso', () => {
    it('should display the at_vso data', () => {
      status.type = 'at_vso'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.atVsoTitle') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.atVsoDescription', { vsoName: '' }))).toBeTruthy()
    })
  })

  describe('when the status type is bva_development', () => {
    it('should display the bva_development data', () => {
      status.type = 'bva_development'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.bvaDevTitle') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.bvaDevDescription'))).toBeTruthy()
    })
  })

  describe('when the status type is decision_in_progress', () => {
    beforeEach(() => {
      status.type = 'decision_in_progress'
    })

    it('should display the decision_in_progress data', () => {
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.decisionInProgressTitle') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.decisionInProgressDescription1'))).toBeTruthy()
    })

    describe('when the appeal type is legacyAppeal', () => {
      it('should display the if you submit evidence text', () => {
        initializeTestInstance(status, 'vba', 'legacyAppeal', '', 'compensation')
        expect(screen.getByRole('header', { name: t('appealDetails.decisionInProgressTitle') })).toBeTruthy()
        expect(screen.getByText(t('appealDetails.decisionInProgressDescription1'))).toBeTruthy()
        expect(screen.getByText(t('appealDetails.decisionInProgressDescription2'))).toBeTruthy()
      })
    })
  })

  describe('when the status type is remand', () => {
    it('should display the remand data', () => {
      status.type = 'remand'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.bvaDecisionAndRemandTitle') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.bvaDecisionAndRemandDescription'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.pleaseSeeYourDecision'))).toBeTruthy()
    })
  })

  describe('when the status type is bva_decision', () => {
    it('should display the bva_decision data', () => {
      status.type = 'bva_decision'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.bvaDecisionAndRemandTitle') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.bvaDecisionAndRemandDescription'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.pleaseSeeYourDecision'))).toBeTruthy()
    })
  })

  describe('when the status type is field_grant', () => {
    it('should display the field_grant data', () => {
      status.type = 'field_grant'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(
        screen.getByRole('header', {
          name: t('appealDetails.fieldGrantStatusTitle', { aojDesc: t('appealDetails.vba') }),
        }),
      ).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.fieldGrantStatusDescription', { aojDesc: t('appealDetails.vba') })),
      ).toBeTruthy()
    })
  })

  describe('when the status type is withdrawn', () => {
    it('should display the withdrawn data', () => {
      status.type = 'withdrawn'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.withdrawn') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.withdrawnDescription'))).toBeTruthy()
    })
  })

  describe('when the status type is ftr', () => {
    it('should display the ftr data', () => {
      status.type = 'ftr'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.ftrTitle') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.ftrDescription'))).toBeTruthy()
    })
  })

  describe('when the status type is ramp', () => {
    it('should display the ramp data', () => {
      status.type = 'ramp'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.rampStatusTitle') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.rampStatusDescription'))).toBeTruthy()
    })
  })

  describe('when the status type is death', () => {
    it('should display the death data', () => {
      status.type = 'death'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.death') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.deathDescription', { name: '' }))).toBeTruthy()
    })
  })

  describe('when the status type is reconsideration', () => {
    it('should display the reconsideration data', () => {
      status.type = 'reconsideration'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.reconsideration') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.reconsiderationDescription'))).toBeTruthy()
    })
  })

  describe('when the status type is other_close', () => {
    it('should display the other_close data', () => {
      status.type = 'other_close'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.ftrTitle') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.otherCloseDescription'))).toBeTruthy()
    })
  })

  describe('when the status type is remand_ssoc', () => {
    it('should display the remand_ssoc data', () => {
      status.type = 'remand_ssoc'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.remandSsocTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.remandSsocDescription', { aojDesc: t('appealDetails.vba'), date: '' })),
      ).toBeTruthy()
    })
  })

  describe('when the status type is merged', () => {
    beforeEach(() => {
      status.type = 'merged'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
    })

    it('should display the merged data', () => {
      expect(screen.getByRole('header', { name: t('appealDetails.mergedTitle') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.mergedDescription1'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.mergedDescription2'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.mergedDescription3'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.mergedDescription4'))).toBeTruthy()
    })

    describe('on click of the link text view', () => {
      it('should launch external link', () => {
        fireEvent.press(screen.getByText(t('appealDetails.mergedDescription2')))
        expect(mockExternalLinkSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when the status type is statutory_opt_in', () => {
    it('should display the statutory_opt_in data', () => {
      status.type = 'statutory_opt_in'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.statutoryOptIn') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.statutoryOptInDescription1'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.statutoryOptInDescription2'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.statutoryOptInDescription3'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.statutoryOptInDescription4'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.statutoryOptInDescription5'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.statutoryOptInDescription6'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.statutoryOptInDescription7'))).toBeTruthy()
    })
  })

  describe('when the status type is evidentiary_period', () => {
    it('should display the evidentiary_period data', () => {
      status.type = 'evidentiary_period'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.evidentiaryPeriodTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.evidentiaryPeriodDescription1', { docketName: 'Direct Review' })),
      ).toBeTruthy()
      expect(screen.getByText(t('appealDetails.evidentiaryPeriodDescription2'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.evidentiaryPeriodDescription3'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.evidentiaryPeriodDescription4'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.evidentiaryPeriodDescription5'))).toBeTruthy()
    })
  })

  describe('when the status type is post_bva_dta_decision', () => {
    it('should display the post_bva_dta_decision data', () => {
      status.type = 'post_bva_dta_decision'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(
        screen.getByRole('header', {
          name: t('appealDetails.postBvaDtaDecisionTitle', { aojDesc: t('appealDetails.vba') }),
        }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          t('appealDetails.postBvaDtaDecisionDescription1', {
            formattedBvaDecisionDate: '',
            aojDesc: t('appealDetails.vba'),
            formattedAojDecisionDate: '',
          }),
        ),
      ).toBeTruthy()
      expect(screen.getByText(t('appealDetails.pleaseSeeYourDecision'))).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.postBvaDtaDecisionDescription2', { aojDesc: t('appealDetails.vba') })),
      ).toBeTruthy()
    })
  })

  describe('when the status type is bva_decision_effectuation', () => {
    it('should display the bva_decision_effectuation data', () => {
      status.type = 'bva_decision_effectuation'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(
        screen.getByRole('header', {
          name: t('appealDetails.bvaDecisionEffectuationTitle', { aojDesc: t('appealDetails.vba') }),
        }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          t('appealDetails.bvaDecisionEffectuationDescription1', {
            formattedBvaDecisionDate: '',
            aojDesc: t('appealDetails.vba'),
            formattedAojDecisionDate: '',
          }),
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.bvaDecisionEffectuationDescription2', { aojDesc: t('appealDetails.vba') })),
      ).toBeTruthy()
    })
  })

  describe('when the status type is sc_received and programArea is comepensation', () => {
    it('should display the sc_received data', () => {
      status.type = 'sc_received'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(
        screen.getByText(t('appealDetails.scReceivedDescription1', { aojDesc: t('appealDetails.vba') })),
      ).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.scReceivedCompDescrition1', { aojDesc: t('appealDetails.vba') })),
      ).toBeTruthy()
      expect(screen.getByText(t('appealDetails.scReceivedCompDescrition2'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.scReceivedCompDescrition3'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.scReceivedCompDescrition4'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.scReceivedCompDescrition5'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.scReceivedCompDescrition6'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.scReceivedDescription2'))).toBeTruthy()
    })
  })

  describe('when the status type is sc_received and programArea is not comepensation', () => {
    it('should display the sc_received data', () => {
      status.type = 'sc_received'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'education')
      expect(screen.getByRole('header', { name: t('appealDetails.scReceivedTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.scReceivedDescription1', { aojDesc: t('appealDetails.vba') })),
      ).toBeTruthy()
      expect(screen.getByText(t('appealDetails.scReceivedNonCompDescrition'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.scReceivedDescription2'))).toBeTruthy()
    })
  })

  describe('when the status type is sc_decision', () => {
    it('should display the sc_decision data', () => {
      status.type = 'sc_decision'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(
        screen.getByRole('header', { name: t('appealDetails.scDecisionTitle', { aojDesc: t('appealDetails.vba') }) }),
      ).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.scDecisionDescription', { aojDesc: t('appealDetails.vba') })),
      ).toBeTruthy()
      expect(screen.getByText(t('appealDetails.pleaseSeeYourDecision'))).toBeTruthy()
    })
  })

  describe('when the status type is sc_closed', () => {
    it('should display the sc_closed data', () => {
      status.type = 'sc_closed'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.scClosedTitle') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.scClosedDescription'))).toBeTruthy()
    })
  })

  describe('when the status type is hlr_received', () => {
    it('should display the hlr_received data', () => {
      status.type = 'hlr_received'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.hlrReceivedTitle') })).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.hlrReceivedDescription1', { aojDesc: t('appealDetails.vba') })),
      ).toBeTruthy()
      expect(screen.getByText(t('appealDetails.hlrReceivedDescription2'))).toBeTruthy()
      expect(screen.getByText(t('appealDetails.hlrReceivedDescription3'))).toBeTruthy()
    })
  })

  describe('when the status type is hlr_decision', () => {
    it('should display the hlr_decision data', () => {
      status.type = 'hlr_decision'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(
        screen.getByRole('header', { name: t('appealDetails.hlrDecisionTitle', { aojDesc: t('appealDetails.vba') }) }),
      ).toBeTruthy()
      expect(
        screen.getByText(t('appealDetails.hlrDecisionDescription', { aojDesc: t('appealDetails.vba') })),
      ).toBeTruthy()
      expect(screen.getByText(t('appealDetails.pleaseSeeYourDecision'))).toBeTruthy()
    })
  })

  describe('when the status type is hlr_dta_error', () => {
    it('should display the hlr_dta_error data', () => {
      status.type = 'hlr_dta_error'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(
        screen.getByRole('header', { name: t('appealDetails.hlrDtaErrorTitle', { aojDesc: t('appealDetails.vba') }) }),
      ).toBeTruthy()
      expect(screen.getByText(t('appealDetails.hlrDtaErrorDescription'))).toBeTruthy()
    })
  })

  describe('when the status type is hlr_closed', () => {
    it('should display the hlr_closed data', () => {
      status.type = 'hlr_closed'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.hlrClosedTitle') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.hlrClosedDescription'))).toBeTruthy()
    })
  })

  describe('when the status type is remand_return', () => {
    it('should display the remand_return data', () => {
      status.type = 'remand_return'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(screen.getByRole('header', { name: t('appealDetails.remandReturn') })).toBeTruthy()
      expect(screen.getByText(t('appealDetails.remandDescription'))).toBeTruthy()
    })
  })
})
