import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'

import AppealCurrentStatus from './AppealCurrentStatus'
import {AppealAOJTypes, AppealStatusData, AppealTypes, EmailData, PhoneData} from 'store/api/types'
import {InitialState} from 'store/reducers'
import {TextView} from 'components'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
  }
})

context('AppealStatus', () => {
  let component: any
  let props: any
  let store: any
  let testInstance: ReactTestInstance

  let status: AppealStatusData = {
    details: {},
    type: 'scheduled_hearing'
  }

  const initializeTestInstance = (status: AppealStatusData, aoj: AppealAOJTypes, appealType: AppealTypes, docketName: string, programArea: string) => {
    props = mockNavProps({
      status,
      aoj,
      appealType,
      docketName,
      programArea
    })

    store = mockStore({
      ...InitialState,
      personalInformation: {
        ...InitialState.personalInformation,
        profile: {
          firstName: '',
          middleName: '',
          lastName: '',
          contactEmail: {} as EmailData,
          signinEmail: '',
          birthDate: '',
          gender: '',
          addresses: '',
          homePhoneNumber: {} as PhoneData,
          mobilePhoneNumber: {} as PhoneData,
          workPhoneNumber: {} as PhoneData,
          faxNumber: {} as PhoneData,
          fullName: 'Larry Brown',
          signinService: 'IDME',
        }
      }
    })

    act(() => {
      component = renderWithProviders(<AppealCurrentStatus {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the status type is scheduled_hearing', () => {
    it('should display the scheduled_hearing data', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Your hearing has been scheduled')
    })

    describe('when the appealType is appeal', () => {
      it('should display the note text', async () => {
        initializeTestInstance(status, 'vba', 'appeal', '', 'compensation')
        expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Note:')
      })
    })
  })

  describe('when the status type is pending_hearing_scheduling', () => {
    beforeEach(async () => {
      status.type = 'pending_hearing_scheduling'
    })

    it('should display the pending_hearing_scheduling data', async () => {
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('You\'re waiting for your hearing to be scheduled')
    })

    describe('when the appealType is appeal', () => {
      it('should display the note text', async () => {
        initializeTestInstance(status, 'vba', 'appeal', '', 'compensation')
        expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Note:')
      })
    })
  })

  describe('when the status type is on_docket', () => {
    beforeEach(async () => {
      status.type = 'on_docket'
    })

    it('should display the on_docket data', async () => {
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Your appeal is waiting to be sent to a judge')
    })

    describe('when the appealType is appeal', () => {
      it('should display the note text', async () => {
        initializeTestInstance(status, 'vba', 'appeal', '', 'compensation')
        expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Note:')
      })
    })
  })

  describe('when the status type is pending_certification_ssoc', () => {
    it('should display the pending_certification_ssoc data', async () => {
      status.type = 'pending_certification_ssoc'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Please review your Supplemental Statement of the Case')
    })
  })

  describe('when the status type is pending_certification', () => {
    it('should display the pending_certification data', async () => {
      status.type = 'pending_certification'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('The Decision Review Officer is finishing their review of your appeal')
    })
  })

  describe('when the status type is pending_form9', () => {
    it('should display the pending_form9 data', async () => {
      status.type = 'pending_form9'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Please review your Statement of the Case')
    })
  })

  describe('when the status type is pending_soc', () => {
    beforeEach(async () => {
      status.type = 'pending_soc'
    })

    it('should display the pending_soc data', async () => {
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('A Decision Review Officer is reviewing your appeal')
    })

    describe('when aoj is other', () => {
      it('should display the aoj description as Agency of Original Jurisdiction', async () => {
        initializeTestInstance(status, 'other', 'higherLevelReview', '', 'compensation')
        expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('The Agency of Original Jurisdiction received your Notice of Disagreement. A Decision Review Officer (DRO) will review all of the evidence related to your appeal, including any new evidence you sent. The DRO may contact you to ask for more evidence or medical exams as needed. When the DRO has completed their review, they’ll determine whether or not they can grant your appeal.')
      })
    })
  })

  describe('when the status type is stayed', () => {
    it('should display the stayed data', async () => {
      status.type = 'stayed'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('The Board is waiting until a higher court makes a decision')
    })
  })

  describe('when the status type is at_vso', () => {
    it('should display the at_vso data', async () => {
      status.type = 'at_vso'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Your appeal is with your Veterans Service Organization')
    })
  })

  describe('when the status type is bva_development', () => {
    it('should display the bva_development data', async () => {
      status.type = 'bva_development'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('The judge is seeking more information before making a decision')
    })
  })

  describe('when the status type is decision_in_progress', () => {
    beforeEach(async () => {
      status.type = 'decision_in_progress'
    })

    it('should display the decision_in_progress data', async () => {
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('A judge is reviewing your appeal')
    })

    describe('when the appeal type is legacyAppeal', () => {
      it('should display the if you submit evidence text', async () => {
        initializeTestInstance(status, 'vba', 'legacyAppeal', '', 'compensation')
        expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('If you submit evidence that isn’t already included in your case, it may delay your appeal.')
      })
    })
  })

  describe('when the status type is remand', () => {
    it('should display the remand data', async () => {
      status.type = 'remand'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('The Board made a decision on your appeal')
    })
  })

  describe('when the status type is bva_decision', () => {
    it('should display the bva_decision data', async () => {
      status.type = 'bva_decision'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('The Board made a decision on your appeal')
    })
  })

  describe('when the status type is field_grant', () => {
    it('should display the field_grant data', async () => {
      status.type = 'field_grant'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('The Veterans Benefits Administration granted your appeal')
    })
  })

  describe('when the status type is withdrawn', () => {
    it('should display the withdrawn data', async () => {
      status.type = 'withdrawn'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('You withdrew your appeal')
    })
  })

  describe('when the status type is ftr', () => {
    it('should display the ftr data', async () => {
      status.type = 'ftr'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Your appeal was closed')
    })
  })

  describe('when the status type is ramp', () => {
    it('should display the ramp data', async () => {
      status.type = 'ramp'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('You opted in to the Rapid Appeals Modernization Program (RAMP)')
    })
  })

  describe('when the status type is death', () => {
    it('should display the death data', async () => {
      status.type = 'death'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('The appeal was closed')
    })
  })

  describe('when the status type is reconsideration', () => {
    it('should display the reconsideration data', async () => {
      status.type = 'reconsideration'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Your Motion for Reconsideration was denied')
    })
  })

  describe('when the status type is other_close', () => {
    it('should display the other_close data', async () => {
      status.type = 'other_close'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Your appeal was closed')
    })
  })

  describe('when the status type is remand_ssoc', () => {
    it('should display the remand_ssoc data', async () => {
      status.type = 'remand_ssoc'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Please review your Supplemental Statement of the Case')
    })
  })

  describe('when the status type is merged', () => {
    beforeEach(async () => {
      status.type = 'merged'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
    })

    it('should display the merged data', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Your appeal was merged')
    })

    describe('on click of the link text view', () => {
      it('should launch external link', async () => {
        testInstance.findAllByType(TextView)[3].props.onPress()
        expect(mockExternalLinkSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when the status type is statutory_opt_in', () => {
    it('should display the statutory_opt_in data', async () => {
      status.type = 'statutory_opt_in'
      initializeTestInstance(status, 'vba', 'higherLevelReview', '', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('You requested a decision review under the Appeals Modernization Act')
    })
  })

  describe('when the status type is evidentiary_period', () => {
    it('should display the evidentiary_period data', async () => {
      status.type = 'evidentiary_period'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Your appeals file is open for new evidence')
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Because you requested the Direct Review appeal option, the Board of Veterans’ Appeals will hold your case open for new evidence for 90 days. You can send new evidence to the Board at:')
    })
  })

  describe('when the status type is post_bva_dta_decision', () => {
    it('should display the post_bva_dta_decision data', async () => {
      status.type = 'post_bva_dta_decision'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('The Veterans Benefits Administration corrected an error')
    })
  })

  describe('when the status type is bva_decision_effectuation', () => {
    it('should display the bva_decision_effectuation data', async () => {
      status.type = 'bva_decision_effectuation'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('The Veterans Benefits Administration corrected an error')
    })
  })

  describe('when the status type is sc_received and programArea is comepensation', () => {
    it('should display the sc_received data', async () => {
      status.type = 'sc_received'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('A reviewer is examining your new evidence')
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('Evidence Intake Center')
    })
  })

  describe('when the status type is sc_received and programArea is not comepensation', () => {
    it('should display the sc_received data', async () => {
      status.type = 'sc_received'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'education')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('A reviewer is examining your new evidence')
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('If you have more evidence to submit, you should do so as soon as possible.')
    })
  })

  describe('when the status type is sc_decision', () => {
    it('should display the sc_decision data', async () => {
      status.type = 'sc_decision'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('The Veterans Benefits Administration made a decision')
    })
  })

  describe('when the status type is sc_closed', () => {
    it('should display the sc_closed data', async () => {
      status.type = 'sc_closed'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Your Supplemental Claim was closed')
    })
  })

  describe('when the status type is hlr_received', () => {
    it('should display the hlr_received data', async () => {
      status.type = 'hlr_received'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('A senior reviewer is taking a new look at your case')
    })
  })

  describe('when the status type is hlr_decision', () => {
    it('should display the hlr_decision data', async () => {
      status.type = 'hlr_decision'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('The Veterans Benefits Administration made a decision')
    })
  })

  describe('when the status type is hlr_dta_error', () => {
    it('should display the hlr_dta_error data', async () => {
      status.type = 'hlr_dta_error'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('The Veterans Benefits Administration is correcting an error')
    })
  })

  describe('when the status type is hlr_closed', () => {
    it('should display the hlr_closed data', async () => {
      status.type = 'hlr_closed'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Your Higher-Level Review was closed')
    })
  })

  describe('when the status type is remand_return', () => {
    it('should display the remand_return data', async () => {
      status.type = 'remand_return'
      initializeTestInstance(status, 'vba', 'higherLevelReview', 'directReview', 'compensation')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Your appeal was returned to the Board of Veterans\' Appeals')
    })
  })
})
