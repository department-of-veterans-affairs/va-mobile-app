import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { AppealAOJTypes, AppealStatusDetailsIssue } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'

import AppealDecision from './AppealDecision'

context('AppealDecision', () => {
  const initializeTestInstance = (
    issues: Array<AppealStatusDetailsIssue>,
    aoj: AppealAOJTypes,
    ama: boolean,
    boardDecision: boolean,
  ): void => {
    const props = mockNavProps({
      issues,
      aoj,
      ama,
      boardDecision,
    })

    render(<AppealDecision {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance([{ description: 'desc', disposition: 'allowed' }], 'vba', true, true)
  })

  it('should initialize', () => {
    expect(screen.getByText(t('appealDetails.granted'))).toBeTruthy()
    expect(
      screen.getByText(
        t('appealDetails.personGrantedOrDenied', { person: 'judge', action: 'granted', pluralizedIssue: 'issue' }),
      ),
    ).toBeTruthy()
    expect(screen.getByText(t('appealDetails.ifThisChangesRating'))).toBeTruthy()
    expect(screen.getByText(t('appealDetails.pleaseSeeYourDecision'))).toBeTruthy()
  })

  describe('when there are remandIssues', () => {
    describe('when ama is true', () => {
      it('should display the text "After the {{aojDesc}} has completed the judge’s instructions to correct the error, they will make a new decision."', () => {
        initializeTestInstance([{ description: 'desc', disposition: 'remand' }], 'vba', true, true)
        expect(
          screen.getByText(
            t('appealDetails.judgeSendingBack', {
              pluralizedIssue: 'this issue',
              aojDesc: t('appealDetails.vba'),
              action: t('appealDetails.correctAnError'),
            }),
          ),
        ).toBeTruthy()
        expect(
          screen.getByText(t('appealDetails.willMakeNewDecision', { aojDesc: t('appealDetails.vba') })),
        ).toBeTruthy()
      })
    })
  })

  describe('when there are allowedIssues', () => {
    describe('when boardDecision is true', () => {
      it('should display the text "If this decision changes your disability rating or your eligibility for VA benefits, you should see this change made in 1 to 2 months."', () => {
        initializeTestInstance([{ description: 'desc', disposition: 'allowed' }], 'vba', true, true)
        expect(
          screen.getByText(
            t('appealDetails.personGrantedOrDenied', { person: 'judge', action: 'granted', pluralizedIssue: 'issue' }),
          ),
        ).toBeTruthy()
        expect(screen.getByText(t('appealDetails.ifThisChangesRating'))).toBeTruthy()
      })
    })
  })

  describe('when there is more than one allowed issue', () => {
    describe('when boardDecision is true', () => {
      it('should display "The judge granted the following issues:"', () => {
        initializeTestInstance(
          [
            { description: 'desc', disposition: 'allowed' },
            { description: 'desc', disposition: 'allowed' },
          ],
          'vba',
          true,
          true,
        )
        expect(
          screen.getByText(
            t('appealDetails.personGrantedOrDenied', { person: 'judge', action: 'granted', pluralizedIssue: 'issues' }),
          ),
        ).toBeTruthy()
        expect(screen.getByText(t('appealDetails.ifThisChangesRating'))).toBeTruthy()
      })
    })

    describe('when boardDecision is false', () => {
      it('should display "The reviewer granted the following issues:"', () => {
        initializeTestInstance(
          [
            { description: 'desc', disposition: 'allowed' },
            { description: 'desc', disposition: 'allowed' },
          ],
          'vba',
          true,
          false,
        )
        expect(
          screen.getByText(
            t('appealDetails.personGrantedOrDenied', {
              person: 'reviewer',
              action: 'granted',
              pluralizedIssue: 'issues',
            }),
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('when there is only one allowed issue', () => {
    describe('when boardDecision is true', () => {
      it('should display "The judge granted the following issue:"', () => {
        initializeTestInstance([{ description: 'desc', disposition: 'allowed' }], 'vba', true, true)
        expect(
          screen.getByText(
            t('appealDetails.personGrantedOrDenied', { person: 'judge', action: 'granted', pluralizedIssue: 'issue' }),
          ),
        ).toBeTruthy()
        expect(screen.getByText(t('appealDetails.ifThisChangesRating'))).toBeTruthy()
      })
    })

    describe('when boardDecision is false', () => {
      it('should display "The reviewer granted the following issue:"', () => {
        initializeTestInstance([{ description: 'desc', disposition: 'allowed' }], 'vba', true, false)
        expect(
          screen.getByText(
            t('appealDetails.personGrantedOrDenied', {
              person: 'reviewer',
              action: 'granted',
              pluralizedIssue: 'issue',
            }),
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('when there is more than one denied issue', () => {
    describe('when boardDecision is true', () => {
      it('should display "The judge denied the following issues:"', () => {
        initializeTestInstance(
          [
            { description: 'desc', disposition: 'denied' },
            { description: 'desc', disposition: 'denied' },
          ],
          'vba',
          true,
          true,
        )
        expect(
          screen.getByText(
            t('appealDetails.personGrantedOrDenied', { person: 'judge', action: 'denied', pluralizedIssue: 'issues' }),
          ),
        ).toBeTruthy()
      })
    })

    describe('when boardDecision is false', () => {
      it('should display "The reviewer denied the following issues:"', () => {
        initializeTestInstance(
          [
            { description: 'desc', disposition: 'denied' },
            { description: 'desc', disposition: 'denied' },
          ],
          'vba',
          true,
          false,
        )
        expect(
          screen.getByText(
            t('appealDetails.personGrantedOrDenied', {
              person: 'reviewer',
              action: 'denied',
              pluralizedIssue: 'issues',
            }),
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('when there is only one denied issue', () => {
    describe('when boardDecision is true', () => {
      it('should display "The judge denied the following issue:"', () => {
        initializeTestInstance([{ description: 'desc', disposition: 'denied' }], 'vba', true, true)
        expect(
          screen.getByText(
            t('appealDetails.personGrantedOrDenied', { person: 'judge', action: 'denied', pluralizedIssue: 'issue' }),
          ),
        ).toBeTruthy()
      })
    })

    describe('when boardDecision is false', () => {
      it('should display "The reviewer denied the following issue:"', () => {
        initializeTestInstance([{ description: 'desc', disposition: 'denied' }], 'vba', true, false)
        expect(
          screen.getByText(
            t('appealDetails.personGrantedOrDenied', {
              person: 'reviewer',
              action: 'denied',
              pluralizedIssue: 'issue',
            }),
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('when there is more than one remand issue', () => {
    describe('when ama is true', () => {
      it('should display "The judge is sending these issues back to the {{aojDesc}} to correct an error"', () => {
        initializeTestInstance(
          [
            { description: 'desc', disposition: 'remand' },
            { description: 'desc', disposition: 'remand' },
          ],
          'vba',
          true,
          true,
        )
        expect(
          screen.getByText(
            t('appealDetails.judgeSendingBack', {
              pluralizedIssue: 'these issues',
              aojDesc: t('appealDetails.vba'),
              action: t('appealDetails.correctAnError'),
            }),
          ),
        ).toBeTruthy()
        expect(
          screen.getByText(t('appealDetails.willMakeNewDecision', { aojDesc: t('appealDetails.vba') })),
        ).toBeTruthy()
      })
    })

    describe('when ama is false', () => {
      it('should display "The judge is sending these issues back to the {{aojDesc}} to gather more evidence or to fix a mistake before deciding whether to grant or deny"', () => {
        initializeTestInstance(
          [
            { description: 'desc', disposition: 'remand' },
            { description: 'desc', disposition: 'remand' },
          ],
          'vba',
          false,
          false,
        )
        expect(
          screen.getByText(
            t('appealDetails.judgeSendingBack', {
              pluralizedIssue: 'these issues',
              aojDesc: t('appealDetails.vba'),
              action: t('appealDetails.gatherMoreEvidence'),
            }),
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('when there is only one remand issue', () => {
    describe('when ama is true', () => {
      it('should display "The judge is sending this issue back to the {{aojDesc}} to correct an error"', () => {
        initializeTestInstance([{ description: 'desc', disposition: 'remand' }], 'vba', true, true)
        expect(
          screen.getByText(
            t('appealDetails.judgeSendingBack', {
              pluralizedIssue: 'this issue',
              aojDesc: t('appealDetails.vba'),
              action: t('appealDetails.correctAnError'),
            }),
          ),
        ).toBeTruthy()
        expect(
          screen.getByText(t('appealDetails.willMakeNewDecision', { aojDesc: t('appealDetails.vba') })),
        ).toBeTruthy()
      })
    })

    describe('when ama is false', () => {
      it('should display "The judge is sending this issue back to the {{aojDesc}} to gather more evidence or to fix a mistake before deciding whether to grant or deny"', () => {
        initializeTestInstance([{ description: 'desc', disposition: 'remand' }], 'vba', false, false)
        expect(
          screen.getByText(
            t('appealDetails.judgeSendingBack', {
              pluralizedIssue: 'this issue',
              aojDesc: t('appealDetails.vba'),
              action: t('appealDetails.gatherMoreEvidence'),
            }),
          ),
        ).toBeTruthy()
      })
    })
  })
})
