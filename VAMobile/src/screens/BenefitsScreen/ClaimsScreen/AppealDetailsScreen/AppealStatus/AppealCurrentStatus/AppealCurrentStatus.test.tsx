import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

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
    expect(screen.getByRole('header', { name: 'Current status' })).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Your hearing has been scheduled' })).toBeTruthy()
    expect(screen.getByText('Your  hearing is scheduled for  at .')).toBeTruthy()
  })

  describe('when the status type is scheduled_hearing', () => {
    describe('when the appealType is appeal', () => {
      it('should display the note text', () => {
        initializeTestInstance(status, 'vba', 'appeal', '', 'compensation')
        expect(
          screen.getByText(
            'Note: If you have new evidence, you can only submit it at your hearing or within the 90 days after your hearing. Please don’t submit additional evidence now.',
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
      expect(screen.getByRole('header', { name: "You're waiting for your hearing to be scheduled" })).toBeTruthy()
      expect(
        screen.getByText(
          "You requested a  hearing. We'll schedule your hearing, and, you’ll receive a notice in the mail at least 30 days before the hearing date.",
        ),
      ).toBeTruthy()
    })

    describe('when the appealType is appeal', () => {
      it('should display the note text', () => {
        initializeTestInstance(status, 'vba', 'appeal', '', 'compensation')
        expect(screen.getByRole('header', { name: "You're waiting for your hearing to be scheduled" })).toBeTruthy()
        expect(
          screen.getByText(
            "You requested a  hearing. We'll schedule your hearing, and, you’ll receive a notice in the mail at least 30 days before the hearing date.",
          ),
        ).toBeTruthy()
        expect(
          screen.getByText(
            'Note: If you have new evidence, you can only submit it at your hearing or within the 90 days after your hearing. Please don’t submit additional evidence now.',
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
      expect(screen.getByText('Your appeal is waiting to be sent to a judge')).toBeTruthy()
      expect(
        screen.getByText(
          'Your appeal is at the Board of Veterans’ Appeals, waiting to be sent to a Veterans Law Judge. Staff at the Board will make sure your case is complete, accurate, and ready to be decided by a judge.',
        ),
      ).toBeTruthy()
    })

    describe('when the appealType is appeal', () => {
      it('should display the note text', () => {
        initializeTestInstance(status, 'vba', 'appeal', '', 'compensation')
        expect(screen.getByRole('header', { name: 'Your appeal is waiting to be sent to a judge' })).toBeTruthy()
        expect(
          screen.getByText(
            'Your appeal is at the Board of Veterans’ Appeals, waiting to be sent to a Veterans Law Judge. Staff at the Board will make sure your case is complete, accurate, and ready to be decided by a judge.',
          ),
        ).toBeTruthy()
        expect(
          screen.getByText(
            'Note: Please don’t submit additional evidence. The judge will only consider evidence that VA already has.',
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('when the status type is pending_certification_ssoc', () => {
    it('should display the pending_certification_ssoc data', () => {
      status.type = 'pending_certification_ssoc'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: 'Please review your Supplemental Statement of the Case' })).toBeTruthy()
      expect(
        screen.getByText(
          'The Veterans Benefits Administration sent you a Supplemental Statement of the Case on . This is because one or both of these is true:',
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'You, your legal representative, your health care provider, or VA added new evidence to your appeal and asked VA to review it before certifying to the Board',
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'VA determined it needed to provide you with more help to develop your appeal, such as helping you get treatment records or giving you a physical exam if needed.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is pending_certification', () => {
    it('should display the pending_certification data', () => {
      status.type = 'pending_certification'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByText('The Decision Review Officer is finishing their review of your appeal')).toBeTruthy()
      expect(
        screen.getByText(
          'The Veterans Benefits Administration received your VA Form 9 and will send your appeal to the Board of Veterans’ Appeals. But first, the Decision Review Officer must certify that they have finished reviewing all of the evidence related to your appeal.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is pending_form9', () => {
    it('should display the pending_form9 data', () => {
      status.type = 'pending_form9'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: 'Please review your Statement of the Case' })).toBeTruthy()
      expect(
        screen.getByText(
          "The Veterans Benefits Administration sent you a Statement of the Case on . The Statement of the Case explains the reasons why they couldn't fully grant your appeal.",
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'You’ll have to take one of these actions within 60 days from the date on the Statement of the Case:',
        ),
      ).toBeTruthy()
      expect(
        screen.getByText("Submit VA Form 9 to continue your appeal to the Board of Veterans' Appeals, or"),
      ).toBeTruthy()
      expect(screen.getByText('Opt in to the new decision review process')).toBeTruthy()
    })
  })

  describe('when the status type is pending_soc', () => {
    beforeEach(() => {
      status.type = 'pending_soc'
    })

    it('should display the pending_soc data', () => {
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: 'A Decision Review Officer is reviewing your appeal' })).toBeTruthy()
      expect(
        screen.getByText(
          'The Veterans Benefits Administration received your Notice of Disagreement. A Decision Review Officer (DRO) will review all of the evidence related to your appeal, including any new evidence you sent. The DRO may contact you to ask for more evidence or medical exams as needed. When the DRO has completed their review, they’ll determine whether or not they can grant your appeal.',
        ),
      ).toBeTruthy()
    })

    describe('when aoj is other', () => {
      it('should display the aoj description as Agency of Original Jurisdiction', () => {
        initializeTestInstance(status, 'other', 'higherLevelReview', '', 'compensation')
        expect(screen.getByRole('header', { name: 'A Decision Review Officer is reviewing your appeal' })).toBeTruthy()
        expect(
          screen.getByText(
            'The Agency of Original Jurisdiction received your Notice of Disagreement. A Decision Review Officer (DRO) will review all of the evidence related to your appeal, including any new evidence you sent. The DRO may contact you to ask for more evidence or medical exams as needed. When the DRO has completed their review, they’ll determine whether or not they can grant your appeal.',
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('when the status type is stayed', () => {
    it('should display the stayed data', () => {
      status.type = 'stayed'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(
        screen.getByRole('header', { name: 'The Board is waiting until a higher court makes a decision' }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'A higher court has asked the Board of Veterans’ Appeals to hold open a group of appeals awaiting review. Yours is one of the appeals held open. The higher court believes that a decision it will make on a different appeal could affect yours.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is at_vso', () => {
    it('should display the at_vso data', () => {
      status.type = 'at_vso'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(
        screen.getByRole('header', { name: 'Your appeal is with your Veterans Service Organization' }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'is reviewing your appeal to make additional arguments in support of your case. For more information, please contact .',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is bva_development', () => {
    it('should display the bva_development data', () => {
      status.type = 'bva_development'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(
        screen.getByRole('header', { name: 'The judge is seeking more information before making a decision' }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'The Board of Veterans’ Appeals is seeking evidence or an outside opinion from a legal, medical, or other professional in order to make a decision about your appeal.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is decision_in_progress', () => {
    beforeEach(() => {
      status.type = 'decision_in_progress'
    })

    it('should display the decision_in_progress data', () => {
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: 'A judge is reviewing your appeal' })).toBeTruthy()
      expect(
        screen.getByText('Your appeal is at the Board of Veterans’ Appeals being reviewed by a Veterans Law Judge.'),
      ).toBeTruthy()
    })

    describe('when the appeal type is legacyAppeal', () => {
      it('should display the if you submit evidence text', () => {
        initializeTestInstance(status, 'vba', 'legacyAppeal', '', 'compensation')
        expect(screen.getByRole('header', { name: 'A judge is reviewing your appeal' })).toBeTruthy()
        expect(
          screen.getByText('Your appeal is at the Board of Veterans’ Appeals being reviewed by a Veterans Law Judge.'),
        ).toBeTruthy()
        expect(
          screen.getByText(
            'If you submit evidence that isn’t already included in your case, it may delay your appeal.',
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('when the status type is remand', () => {
    it('should display the remand data', () => {
      status.type = 'remand'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: 'The Board made a decision on your appeal' })).toBeTruthy()
      expect(
        screen.getByText('The Board of Veterans’ Appeals sent you a decision on your appeal. Here’s an overview:'),
      ).toBeTruthy()
      expect(screen.getByText('Please see your decision for more details.')).toBeTruthy()
    })
  })

  describe('when the status type is bva_decision', () => {
    it('should display the bva_decision data', () => {
      status.type = 'bva_decision'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: 'The Board made a decision on your appeal' })).toBeTruthy()
      expect(
        screen.getByText('The Board of Veterans’ Appeals sent you a decision on your appeal. Here’s an overview:'),
      ).toBeTruthy()
      expect(screen.getByText('Please see your decision for more details.')).toBeTruthy()
    })
  })

  describe('when the status type is field_grant', () => {
    it('should display the field_grant data', () => {
      status.type = 'field_grant'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(
        screen.getByRole('header', { name: 'The Veterans Benefits Administration granted your appeal' }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'The Veterans Benefits Administration agreed with you and decided to overturn the original decision. If this decision changes your disability rating or eligibility for VA benefits, you should see this change made in 1 to 2 months.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is withdrawn', () => {
    it('should display the withdrawn data', () => {
      status.type = 'withdrawn'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: 'You withdrew your appeal' })).toBeTruthy()
      expect(
        screen.getByText(
          'You chose not to continue your appeal. If this information is incorrect, please contact your Veterans Service Organization or representative for more information.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is ftr', () => {
    it('should display the ftr data', () => {
      status.type = 'ftr'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: 'Your appeal was closed' })).toBeTruthy()
      expect(
        screen.getByText(
          'You didn’t take an action VA requested in order to continue your appeal. If this information is incorrect, or if you want to reopen your appeal, please contact your Veterans Service Organization or representative for more information.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is ramp', () => {
    it('should display the ramp data', () => {
      status.type = 'ramp'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(
        screen.getByRole('header', { name: 'You opted in to the Rapid Appeals Modernization Program (RAMP)' }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'You chose to participate in the new Supplemental Claim or Higher-Level Review options. This doesn’t mean that your appeal has been closed. If this information is incorrect, please contact your Veterans Service Organization or representative as soon as possible.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is death', () => {
    it('should display the death data', () => {
      status.type = 'death'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: 'The appeal was closed' })).toBeTruthy()
      expect(
        screen.getByText(
          'VA records indicate that  is deceased, so this appeal has been closed. If this information is incorrect, please contact your Veterans Service Organization or representative as soon as possible.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is reconsideration', () => {
    it('should display the reconsideration data', () => {
      status.type = 'reconsideration'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: 'Your Motion for Reconsideration was denied' })).toBeTruthy()
      expect(
        screen.getByText(
          'The Board of Veterans’ Appeals declined to reopen your appeal. Please contact your Veterans Service Organization or representative for more information.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is other_close', () => {
    it('should display the other_close data', () => {
      status.type = 'other_close'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: 'Your appeal was closed' })).toBeTruthy()
      expect(
        screen.getByText(
          'Your appeal was dismissed or closed. Please contact your Veterans Service Organization or representative for more information.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is remand_ssoc', () => {
    it('should display the remand_ssoc data', () => {
      status.type = 'remand_ssoc'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(screen.getByRole('header', { name: 'Please review your Supplemental Statement of the Case' })).toBeTruthy()
      expect(
        screen.getByText(
          'The Veterans Benefits Administration sent you a Supplemental Statement of the Case on  because, after completing the remand instructions from the Board, they couldn’t fully grant your appeal.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is merged', () => {
    beforeEach(() => {
      status.type = 'merged'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
    })

    it('should display the merged data', () => {
      expect(screen.getByRole('header', { name: 'Your appeal was merged' })).toBeTruthy()
      expect(
        screen.getByText(
          "Your appeal was merged with another appeal. The Board of Veterans'  Appeals merges appeals so that you can receive a single decision on as many appealed issues as possible. This appeal was merged with an older appeal that was closest to receiving a Board decision.",
        ),
      ).toBeTruthy()
      expect(screen.getByText('Check')).toBeTruthy()
      expect(screen.getByText('Your claims and appeals')).toBeTruthy()
      expect(screen.getByText('for the appeal that contains the issues merged from this appeal.')).toBeTruthy()
    })

    describe('on click of the link text view', () => {
      it('should launch external link', () => {
        fireEvent.press(screen.getByText('Check'))
        expect(mockExternalLinkSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when the status type is statutory_opt_in', () => {
    it('should display the statutory_opt_in data', () => {
      status.type = 'statutory_opt_in'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(
        screen.getByRole('header', { name: 'You requested a decision review under the Appeals Modernization Act' }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'A new law, the Veterans Appeals Improvement and Modernization Act, took effect on February 19, 2019. Although your appeal started before the new law took effect, you asked for it to be converted into one of the new decision review options.',
        ),
      ).toBeTruthy()
      expect(screen.getByText('Check')).toBeTruthy()
      expect(screen.getByText('Your claims and appeals')).toBeTruthy()
      expect(
        screen.getByText('for the decision review that contains the issues from this appeal, or learn more about'),
      ).toBeTruthy()
      expect(screen.getByText('decision reviews under the Appeals Modernization Act.')).toBeTruthy()
    })
  })

  describe('when the status type is evidentiary_period', () => {
    it('should display the evidentiary_period data', () => {
      status.type = 'evidentiary_period'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(screen.getByRole('header', { name: 'Your appeals file is open for new evidence' })).toBeTruthy()
      expect(
        screen.getByText(
          'Because you requested the Direct Review appeal option, the Board of Veterans’ Appeals will hold your case open for new evidence for 90 days. You can send new evidence to the Board at:',
        ),
      ).toBeTruthy()
      expect(screen.getByText('Board of Veterans’ Appeals')).toBeTruthy()
      expect(screen.getByText('PO Box 27063')).toBeTruthy()
      expect(screen.getByText('Washington, DC 20038')).toBeTruthy()
      expect(screen.getByText('Fax 844-678-8979')).toBeTruthy()
    })
  })

  describe('when the status type is post_bva_dta_decision', () => {
    it('should display the post_bva_dta_decision data', () => {
      status.type = 'post_bva_dta_decision'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(
        screen.getByRole('header', { name: 'The Veterans Benefits Administration corrected an error' }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          "In the  decision, a judge at the Board of Veterans’ Appeals identified an error that needed to be corrected. A reviewer at the Veterans Benefits Administration completed the judge’s instructions and sent you a new decision on . Here's an overview:",
        ),
      ).toBeTruthy()
      expect(screen.getByText('Please see your decision for more details.')).toBeTruthy()
      expect(
        screen.getByText(
          'If you disagree with either the Board decision or the Veterans Benefits Administration decision, you can request another review. The review options available to you depend on which decision you disagree with.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is bva_decision_effectuation', () => {
    it('should display the bva_decision_effectuation data', () => {
      status.type = 'bva_decision_effectuation'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(
        screen.getByRole('header', { name: 'The Veterans Benefits Administration corrected an error' }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'On , a judge at the Board of Veterans’ Appeals made a decision that changes your disability rating or eligibility for benefits. On , the Veterans Benefits Administration sent you a new decision that updates your benefits.',
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'If you disagree with either the Board decision or the Veterans Benefits Administration decision, you can request another review. The review options available to you depend on which decision you disagree with.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is sc_received and programArea is comepensation', () => {
    it('should display the sc_received data', () => {
      status.type = 'sc_received'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(
        screen.getByText(
          'A Supplemental Claim allows you to add new and relevant evidence to your case. When you filed a Supplemental Claim, you included new evidence or identified evidence that the Veterans Benefits Administration should obtain.',
        ),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'If you have more evidence to submit, you should do so as soon as possible. You can send new evidence to the Veterans Benefits Administration at:',
        ),
      ).toBeTruthy()
      expect(screen.getByText('Department of Veterans Affairs')).toBeTruthy()
      expect(screen.getByText('Evidence Intake Center')).toBeTruthy()
      expect(screen.getByText('PO Box 4444')).toBeTruthy()
      expect(screen.getByText('Janesville, WI 53547-4444')).toBeTruthy()
      expect(screen.getByText('Fax 844-531-7818')).toBeTruthy()
      expect(
        screen.getByText(
          'A reviewer will look at this new evidence, as well as evidence VA already had, and determine whether it changes the decision. If needed, they may contact you to ask for more evidence or to schedule a new medical exam.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is sc_received and programArea is not comepensation', () => {
    it('should display the sc_received data', () => {
      status.type = 'sc_received'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'education')
      expect(screen.getByRole('header', { name: 'A reviewer is examining your new evidence' })).toBeTruthy()
      expect(
        screen.getByText(
          'A Supplemental Claim allows you to add new and relevant evidence to your case. When you filed a Supplemental Claim, you included new evidence or identified evidence that the Veterans Benefits Administration should obtain.',
        ),
      ).toBeTruthy()
      expect(
        screen.getByText('If you have more evidence to submit, you should do so as soon as possible.'),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'A reviewer will look at this new evidence, as well as evidence VA already had, and determine whether it changes the decision. If needed, they may contact you to ask for more evidence or to schedule a new medical exam.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is sc_decision', () => {
    it('should display the sc_decision data', () => {
      status.type = 'sc_decision'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(screen.getByRole('header', { name: 'The Veterans Benefits Administration made a decision' })).toBeTruthy()
      expect(
        screen.getByText(
          'The Veterans Benefits Administration sent you a decision on your Supplemental Claim. Here’s an overview:',
        ),
      ).toBeTruthy()
      expect(screen.getByText('Please see your decision for more details.')).toBeTruthy()
    })
  })

  describe('when the status type is sc_closed', () => {
    it('should display the sc_closed data', () => {
      status.type = 'sc_closed'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(screen.getByRole('header', { name: 'Your Supplemental Claim was closed' })).toBeTruthy()
      expect(
        screen.getByText(
          'Your Supplemental Claim was closed. Please contact VA or your Veterans Service Organization or representative for more information.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is hlr_received', () => {
    it('should display the hlr_received data', () => {
      status.type = 'hlr_received'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(
        screen.getByRole('header', { name: 'A higher-level reviewer is taking a new look at your case' }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'By requesting a Higher-Level Review, you asked for a higher-level reviewer at the Veterans Benefits Administration to look at your case and determine whether they can change the decision based on a difference of opinion or because VA made an error.',
        ),
      ).toBeTruthy()
      expect(screen.getByText('Note:')).toBeTruthy()
      expect(
        screen.getByText(
          'Please don’t submit additional evidence. The reviewer will only consider evidence that VA already has.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is hlr_decision', () => {
    it('should display the hlr_decision data', () => {
      status.type = 'hlr_decision'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(screen.getByRole('header', { name: 'The Veterans Benefits Administration made a decision' })).toBeTruthy()
      expect(
        screen.getByText(
          'The Veterans Benefits Administration sent you a decision on your Higher-Level Review. Here’s an overview:',
        ),
      ).toBeTruthy()
      expect(screen.getByText('Please see your decision for more details.')).toBeTruthy()
    })
  })

  describe('when the status type is hlr_dta_error', () => {
    it('should display the hlr_dta_error data', () => {
      status.type = 'hlr_dta_error'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(
        screen.getByRole('header', { name: 'The Veterans Benefits Administration is correcting an error' }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'During their review, the higher-level reviewer identified an error that must be corrected before deciding your case. If needed, VA may contact you to ask for more evidence or to schedule a new medical exam.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is hlr_closed', () => {
    it('should display the hlr_closed data', () => {
      status.type = 'hlr_closed'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(screen.getByRole('header', { name: 'Your Higher-Level Review was closed' })).toBeTruthy()
      expect(
        screen.getByText(
          'Your Higher-Level Review was closed. Please contact VA or your Veterans Service Organization or representative for more information.',
        ),
      ).toBeTruthy()
    })
  })

  describe('when the status type is remand_return', () => {
    it('should display the remand_return data', () => {
      status.type = 'remand_return'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(
        screen.getByRole('header', { name: "Your appeal was returned to the Board of Veterans' Appeals" }),
      ).toBeTruthy()
      expect(
        screen.getByText(
          'The Veterans Benefits Administration finished their work on the remand and will return your case to the Board of Veterans’ Appeals.',
        ),
      ).toBeTruthy()
    })
  })
})
