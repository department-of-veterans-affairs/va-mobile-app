import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, renderWithProviders } from 'testUtils'

import AppealPhase from './AppealPhase'
import {AppealEventTypes} from 'store/api/types'
import {TextView} from 'components'

context('AppealPhase', () => {
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (type: AppealEventTypes): void => {
    props = mockNavProps({
      event: {
        date: '2015-04-24',
        type,
      }
    })

    act(() => {
      component = renderWithProviders(<AppealPhase {...props} />)
    })

    testInstance = component.root
  }

  beforeEach(() => {
   initializeTestInstance('claim_decision')
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the type is claim_decision', () => {
    it('should display "VA sent you a claim decision" as the phase header', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA sent you a claim decision')
    })
  })

  describe('when the type is nod', () => {
    it('should display "VA received your Notice of Disagreement" as the phase header', async () => {
      initializeTestInstance('nod')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA received your Notice of Disagreement')
    })
  })

  describe('when the type is nod', () => {
    it('should display "VA received your Notice of Disagreement" as the phase header', async () => {
      initializeTestInstance('nod')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA received your Notice of Disagreement')
    })
  })

  describe('when the type is soc', () => {
    it('should display "VA sent you a Statement of the Case" as the phase header', async () => {
      initializeTestInstance('soc')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA sent you a Statement of the Case')
    })
  })

  describe('when the type is form9', () => {
    it('should display "VA received your Form 9" as the phase header', async () => {
      initializeTestInstance('form9')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA received your Form 9')
    })
  })

  describe('when the type is ssoc', () => {
    it('should display "VA sent you a Supplemental Statement of the Case" as the phase header', async () => {
      initializeTestInstance('ssoc')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA sent you a Supplemental Statement of the Case')
    })
  })

  describe('when the type is certified', () => {
    it('should display "Your appeal was sent to the Board of Veterans\' Appeals" as the phase header', async () => {
      initializeTestInstance('certified')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Your appeal was sent to the Board of Veterans\' Appeals')
    })
  })

  describe('when the type is hearing_held', () => {
    it('should display "You attended a hearing with a Veterans Law Judge" as the phase header', async () => {
      initializeTestInstance('hearing_held')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('You attended a hearing with a Veterans Law Judge')
    })
  })

  describe('when the type is hearing_no_show', () => {
    it('should display "You missed your hearing with a Veterans Law Judge" as the phase header', async () => {
      initializeTestInstance('hearing_no_show')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('You missed your hearing with a Veterans Law Judge')
    })
  })

  describe('when the type is transcript', () => {
    it('should display "VA sent you a transcript of your hearing" as the phase header', async () => {
      initializeTestInstance('transcript')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA sent you a transcript of your hearing')
    })
  })

  describe('when the type is bva_decision', () => {
    it('should display "Board of Veterans\' Appeals made a decision" as the phase header', async () => {
      initializeTestInstance('bva_decision')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Board of Veterans\' Appeals made a decision')
    })
  })

  describe('when the type is cavc_decision', () => {
    it('should display "U.S. Court of Appeals for Veterans Claims made a decision" as the phase header', async () => {
      initializeTestInstance('cavc_decision')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('U.S. Court of Appeals for Veterans Claims made a decision')
    })
  })

  describe('when the type is remand_return', () => {
    it('should display "Your appeal was returned to the Board of Veterans\' Appeals" as the phase header', async () => {
      initializeTestInstance('remand_return')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Your appeal was returned to the Board of Veterans\' Appeals')
    })
  })

  describe('when the type is ramp_notice', () => {
    it('should display "VA sent you a letter about the Rapid Appeals Modernization Program" as the phase header', async () => {
      initializeTestInstance('ramp_notice')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA sent you a letter about the Rapid Appeals Modernization Program')
    })
  })

  describe('when the type is field_grant', () => {
    it('should display "VA granted one or more issues" as the phase header', async () => {
      initializeTestInstance('field_grant')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA granted one or more issues')
    })
  })

  describe('when the type is withdrawn', () => {
    it('should display "You withdrew your appeal" as the phase header', async () => {
      initializeTestInstance('withdrawn')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('You withdrew your appeal')
    })
  })

  describe('when the type is other_close', () => {
    it('should display "Your appeal was closed" as the phase header', async () => {
      initializeTestInstance('other_close')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Your appeal was closed')
    })
  })

  describe('when the type is ramp', () => {
    it('should display "You opted in to the Rapid Appeals Modernization Program" as the phase header', async () => {
      initializeTestInstance('ramp')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('You opted in to the Rapid Appeals Modernization Program')
    })
  })

  describe('when the type is death', () => {
    it('should display "The appeal was closed" as the phase header', async () => {
      initializeTestInstance('death')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('The appeal was closed')
    })
  })

  describe('when the type is merged', () => {
    it('should display "Your appeals were merged" as the phase header', async () => {
      initializeTestInstance('merged')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Your appeals were merged')
    })
  })

  describe('when the type is reconsideration', () => {
    it('should display "Your Motion for Reconsideration was denied" as the phase header', async () => {
      initializeTestInstance('reconsideration')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Your Motion for Reconsideration was denied')
    })
  })

  describe('when the type is vacated', () => {
    it('should display "Board of Veterans\' Appeals vacated a previous decision" as the phase header', async () => {
      initializeTestInstance('vacated')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Board of Veterans\' Appeals vacated a previous decision')
    })
  })

  describe('when the type is sc_request', () => {
    it('should display "VA received your Supplemental Claim request" as the phase header', async () => {
      initializeTestInstance('sc_request')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA received your Supplemental Claim request')
    })
  })

  describe('when the type is hlr_request', () => {
    it('should display "VA received your Higher-Level Review request" as the phase header', async () => {
      initializeTestInstance('hlr_request')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA received your Higher-Level Review request')
    })
  })

  describe('when the type is ama_nod', () => {
    it('should display "Board of Veterans’ Appeals received your appeal" as the phase header', async () => {
      initializeTestInstance('ama_nod')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Board of Veterans’ Appeals received your appeal')
    })
  })

  describe('when the type is docket_change', () => {
    it('should display "You switched appeal options" as the phase header', async () => {
      initializeTestInstance('docket_change')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('You switched appeal options')
    })
  })

  describe('when the type is distributed_to_vlj', () => {
    it('should display "Your appeal was distributed to a Veterans Law Judge" as the phase header', async () => {
      initializeTestInstance('distributed_to_vlj')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Your appeal was distributed to a Veterans Law Judge')
    })
  })

  describe('when the type is bva_decision_effectuation', () => {
    it('should display "VA updated your benefits to reflect the Board’s decision" as the phase header', async () => {
      initializeTestInstance('bva_decision_effectuation')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA updated your benefits to reflect the Board’s decision')
    })
  })

  describe('when the type is dta_decision', () => {
    it('should display "VA corrected an error and made a new decision" as the phase header', async () => {
      initializeTestInstance('dta_decision')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA corrected an error and made a new decision')
    })
  })

  describe('when the type is sc_other_close', () => {
    it('should display "Your Supplemental Claim was closed" as the phase header', async () => {
      initializeTestInstance('sc_other_close')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Your Supplemental Claim was closed')
    })
  })

  describe('when the type is hlr_decision', () => {
    it('should display "VA made a new decision" as the phase header', async () => {
      initializeTestInstance('hlr_decision')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA made a new decision')
    })
  })

  describe('when the type is hlr_dta_error', () => {
    it('should display "VA identified an error that must be corrected" as the phase header', async () => {
      initializeTestInstance('hlr_dta_error')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('VA identified an error that must be corrected')
    })
  })

  describe('when the type is hlr_other_close', () => {
    it('should display "Your Higher-Level Review was closed" as the phase header', async () => {
      initializeTestInstance('hlr_other_close')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Your Higher-Level Review was closed')
    })
  })

  describe('when the type is statutory_opt_in', () => {
    it('should display "You requested a decision review under the Appeals Modernization Act" as the phase header', async () => {
      initializeTestInstance('statutory_opt_in')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('You requested a decision review under the Appeals Modernization Act')
    })
  })

  describe('when the type is ftr', () => {
    it('should display "Unknown" as the phase header', async () => {
      initializeTestInstance('ftr')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Unknown')
    })
  })

  describe('when the type is record_designation', () => {
    it('should display "Unknown" as the phase header', async () => {
      initializeTestInstance('record_designation')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Unknown')
    })
  })

  describe('when the type is dro_hearing_held', () => {
    it('should display "Unknown" as the phase header', async () => {
      initializeTestInstance('dro_hearing_held')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Unknown')
    })
  })

  describe('when the type is dro_hearing_cancelled', () => {
    it('should display "Unknown" as the phase header', async () => {
      initializeTestInstance('dro_hearing_cancelled')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Unknown')
    })
  })

  describe('when the type is dro_hearing_no_show', () => {
    it('should display "Unknown" as the phase header', async () => {
      initializeTestInstance('dro_hearing_no_show')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Unknown')
    })
  })
})
