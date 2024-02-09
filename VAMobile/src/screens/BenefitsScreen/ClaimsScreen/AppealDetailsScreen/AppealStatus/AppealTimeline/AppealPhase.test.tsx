import React from 'react'

import { screen } from '@testing-library/react-native'

import { AppealEventTypes } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'

import AppealPhase from './AppealPhase'

context('AppealPhase', () => {
  const initializeTestInstance = (type: AppealEventTypes): void => {
    const props = mockNavProps({
      event: {
        date: '2015-04-24',
        type,
      },
    })

    render(<AppealPhase {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance('claim_decision')
  })

  it('should initialize', () => {
    expect(screen.getByText('VA sent you a claim decision')).toBeTruthy()
    expect(screen.getByText('On April 24, 2015')).toBeTruthy()
  })

  describe('when the type is nod', () => {
    it('should display "VA received your Notice of Disagreement" as the phase header', () => {
      initializeTestInstance('nod')
      expect(screen.getByText('VA received your Notice of Disagreement')).toBeTruthy()
    })
  })

  describe('when the type is soc', () => {
    it('should display "VA sent you a Statement of the Case" as the phase header', () => {
      initializeTestInstance('soc')
      expect(screen.getByText('VA sent you a Statement of the Case')).toBeTruthy()
    })
  })

  describe('when the type is form9', () => {
    it('should display "VA received your Form 9" as the phase header', () => {
      initializeTestInstance('form9')
      expect(screen.getByText('VA received your Form 9')).toBeTruthy()
    })
  })

  describe('when the type is ssoc', () => {
    it('should display "VA sent you a Supplemental Statement of the Case" as the phase header', () => {
      initializeTestInstance('ssoc')
      expect(screen.getByText('VA sent you a Supplemental Statement of the Case')).toBeTruthy()
    })
  })

  describe('when the type is certified', () => {
    it('should display "Your appeal was sent to the Board of Veterans\' Appeals" as the phase header', () => {
      initializeTestInstance('certified')
      expect(screen.getByText("Your appeal was sent to the Board of Veterans' Appeals")).toBeTruthy()
    })
  })

  describe('when the type is hearing_held', () => {
    it('should display "You attended a hearing with a Veterans Law Judge" as the phase header', () => {
      initializeTestInstance('hearing_held')
      expect(screen.getByText('You attended a hearing with a Veterans Law Judge')).toBeTruthy()
    })
  })

  describe('when the type is hearing_no_show', () => {
    it('should display "You missed your hearing with a Veterans Law Judge" as the phase header', () => {
      initializeTestInstance('hearing_no_show')
      expect(screen.getByText('You missed your hearing with a Veterans Law Judge')).toBeTruthy()
    })
  })

  describe('when the type is transcript', () => {
    it('should display "VA sent you a transcript of your hearing" as the phase header', () => {
      initializeTestInstance('transcript')
      expect(screen.getByText('VA sent you a transcript of your hearing')).toBeTruthy()
    })
  })

  describe('when the type is bva_decision', () => {
    it('should display "Board of Veterans\' Appeals made a decision" as the phase header', () => {
      initializeTestInstance('bva_decision')
      expect(screen.getByText("Board of Veterans' Appeals made a decision")).toBeTruthy()
    })
  })

  describe('when the type is cavc_decision', () => {
    it('should display "U.S. Court of Appeals for Veterans Claims made a decision" as the phase header', () => {
      initializeTestInstance('cavc_decision')
      expect(screen.getByText('U.S. Court of Appeals for Veterans Claims made a decision')).toBeTruthy()
    })
  })

  describe('when the type is remand_return', () => {
    it('should display "Your appeal was returned to the Board of Veterans\' Appeals" as the phase header', () => {
      initializeTestInstance('remand_return')
      expect(screen.getByText("Your appeal was returned to the Board of Veterans' Appeals")).toBeTruthy()
    })
  })

  describe('when the type is ramp_notice', () => {
    it('should display "VA sent you a letter about the Rapid Appeals Modernization Program" as the phase header', () => {
      initializeTestInstance('ramp_notice')
      expect(screen.getByText('VA sent you a letter about the Rapid Appeals Modernization Program')).toBeTruthy()
    })
  })

  describe('when the type is field_grant', () => {
    it('should display "VA granted one or more issues" as the phase header', () => {
      initializeTestInstance('field_grant')
      expect(screen.getByText('VA granted one or more issues')).toBeTruthy()
    })
  })

  describe('when the type is withdrawn', () => {
    it('should display "You withdrew your appeal" as the phase header', () => {
      initializeTestInstance('withdrawn')
      expect(screen.getByText('You withdrew your appeal')).toBeTruthy()
    })
  })

  describe('when the type is other_close', () => {
    it('should display "Your appeal was closed" as the phase header', () => {
      initializeTestInstance('other_close')
      expect(screen.getByText('Your appeal was closed')).toBeTruthy()
    })
  })

  describe('when the type is ramp', () => {
    it('should display "You opted in to the Rapid Appeals Modernization Program" as the phase header', () => {
      initializeTestInstance('ramp')
      expect(screen.getByText('You opted in to the Rapid Appeals Modernization Program')).toBeTruthy()
    })
  })

  describe('when the type is death', () => {
    it('should display "The appeal was closed" as the phase header', () => {
      initializeTestInstance('death')
      expect(screen.getByText('The appeal was closed')).toBeTruthy()
    })
  })

  describe('when the type is merged', () => {
    it('should display "Your appeals were merged" as the phase header', () => {
      initializeTestInstance('merged')
      expect(screen.getByText('Your appeals were merged')).toBeTruthy()
    })
  })

  describe('when the type is reconsideration', () => {
    it('should display "Your Motion for Reconsideration was denied" as the phase header', () => {
      initializeTestInstance('reconsideration')
      expect(screen.getByText('Your Motion for Reconsideration was denied')).toBeTruthy()
    })
  })

  describe('when the type is vacated', () => {
    it('should display "Board of Veterans\' Appeals vacated a previous decision" as the phase header', () => {
      initializeTestInstance('vacated')
      expect(screen.getByText("Board of Veterans' Appeals vacated a previous decision")).toBeTruthy()
    })
  })

  describe('when the type is sc_request', () => {
    it('should display "VA received your Supplemental Claim request" as the phase header', () => {
      initializeTestInstance('sc_request')
      expect(screen.getByText('VA received your Supplemental Claim request')).toBeTruthy()
    })
  })

  describe('when the type is hlr_request', () => {
    it('should display "VA received your Higher-Level Review request" as the phase header', () => {
      initializeTestInstance('hlr_request')
      expect(screen.getByText('VA received your Higher-Level Review request')).toBeTruthy()
    })
  })

  describe('when the type is ama_nod', () => {
    it('should display "Board of Veterans’ Appeals received your appeal" as the phase header', () => {
      initializeTestInstance('ama_nod')
      expect(screen.getByText('Board of Veterans’ Appeals received your appeal')).toBeTruthy()
    })
  })

  describe('when the type is docket_change', () => {
    it('should display "You switched appeal options" as the phase header', () => {
      initializeTestInstance('docket_change')
      expect(screen.getByText('You switched appeal options')).toBeTruthy()
    })
  })

  describe('when the type is distributed_to_vlj', () => {
    it('should display "Your appeal was distributed to a Veterans Law Judge" as the phase header', () => {
      initializeTestInstance('distributed_to_vlj')
      expect(screen.getByText('Your appeal was distributed to a Veterans Law Judge')).toBeTruthy()
    })
  })

  describe('when the type is bva_decision_effectuation', () => {
    it('should display "VA updated your benefits to reflect the Board’s decision" as the phase header', () => {
      initializeTestInstance('bva_decision_effectuation')
      expect(screen.getByText('VA updated your benefits to reflect the Board’s decision')).toBeTruthy()
    })
  })

  describe('when the type is dta_decision', () => {
    it('should display "VA corrected an error and made a new decision" as the phase header', () => {
      initializeTestInstance('dta_decision')
      expect(screen.getByText('VA corrected an error and made a new decision')).toBeTruthy()
    })
  })

  describe('when the type is sc_other_close', () => {
    it('should display "Your Supplemental Claim was closed" as the phase header', () => {
      initializeTestInstance('sc_other_close')
      expect(screen.getByText('Your Supplemental Claim was closed')).toBeTruthy()
    })
  })

  describe('when the type is hlr_decision', () => {
    it('should display "VA made a new decision" as the phase header', () => {
      initializeTestInstance('hlr_decision')
      expect(screen.getByText('VA made a new decision')).toBeTruthy()
    })
  })

  describe('when the type is hlr_dta_error', () => {
    it('should display "VA identified an error that must be corrected" as the phase header', () => {
      initializeTestInstance('hlr_dta_error')
      expect(screen.getByText('VA identified an error that must be corrected')).toBeTruthy()
    })
  })

  describe('when the type is hlr_other_close', () => {
    it('should display "Your Higher-Level Review was closed" as the phase header', () => {
      initializeTestInstance('hlr_other_close')
      expect(screen.getByText('Your Higher-Level Review was closed')).toBeTruthy()
    })
  })

  describe('when the type is statutory_opt_in', () => {
    it('should display "You requested a decision review under the Appeals Modernization Act" as the phase header', () => {
      initializeTestInstance('statutory_opt_in')
      expect(screen.getByText('You requested a decision review under the Appeals Modernization Act')).toBeTruthy()
    })
  })

  describe('when the type is ftr', () => {
    it('should display "Unknown" as the phase header', () => {
      initializeTestInstance('ftr')
      expect(screen.getByText('Unknown')).toBeTruthy()
    })
  })

  describe('when the type is record_designation', () => {
    it('should display "Unknown" as the phase header', () => {
      initializeTestInstance('record_designation')
      expect(screen.getByText('Unknown')).toBeTruthy()
    })
  })

  describe('when the type is dro_hearing_held', () => {
    it('should display "Unknown" as the phase header', () => {
      initializeTestInstance('dro_hearing_held')
      expect(screen.getByText('Unknown')).toBeTruthy()
    })
  })

  describe('when the type is dro_hearing_cancelled', () => {
    it('should display "Unknown" as the phase header', () => {
      initializeTestInstance('dro_hearing_cancelled')
      expect(screen.getByText('Unknown')).toBeTruthy()
    })
  })

  describe('when the type is dro_hearing_no_show', () => {
    it('should display "Unknown" as the phase header', () => {
      initializeTestInstance('dro_hearing_no_show')
      expect(screen.getByText('Unknown')).toBeTruthy()
    })
  })
})
