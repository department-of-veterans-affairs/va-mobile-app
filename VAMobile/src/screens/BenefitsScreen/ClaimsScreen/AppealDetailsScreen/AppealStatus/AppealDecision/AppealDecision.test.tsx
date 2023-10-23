import 'react-native'
import React from 'react'

import { screen } from '@testing-library/react-native'
import { context, mockNavProps, render } from 'testUtils'
import AppealDecision from './AppealDecision'
import { AppealAOJTypes, AppealStatusDetailsIssue } from 'store/api/types'

context('AppealDecision', () => {
  const initializeTestInstance = (issues: Array<AppealStatusDetailsIssue>, aoj: AppealAOJTypes, ama: boolean, boardDecision: boolean): void => {
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

  it('should initialize', async () => {
    expect(screen.getByText('Granted')).toBeTruthy()
    expect(screen.getByText('The judge granted the following issue:')).toBeTruthy()
    expect(screen.getByText('If this decision changes your disability rating or your eligibility for VA benefits, you should see this change made in 1 to 2 months.')).toBeTruthy()
    expect(screen.getByText('Please see your decision for more details.')).toBeTruthy()
  })

  describe('when there are remandIssues', () => {
    describe('when ama is true', () => {
      it('should display the text "After the {{aojDesc}} has completed the judge’s instructions to correct the error, they will make a new decision."', async () => {
        initializeTestInstance([{ description: 'desc', disposition: 'remand' }], 'vba', true, true)
        expect(screen.getByText('The judge is sending this issue back to the Veterans Benefits Administration to correct an error')).toBeTruthy()
        expect(screen.getByText('After the Veterans Benefits Administration has completed the judge’s instructions to correct the error, they will make a new decision.')).toBeTruthy()
      })
    })
  })

  describe('when there are allowedIssues', () => {
    describe('when boardDecision is true', () => {
      it('should display the text "If this decision changes your disability rating or your eligibility for VA benefits, you should see this change made in 1 to 2 months."', async () => {
        initializeTestInstance([{ description: 'desc', disposition: 'allowed' }], 'vba', true, true)
        expect(screen.getByText('The judge granted the following issue:')).toBeTruthy()
        expect(screen.getByText('If this decision changes your disability rating or your eligibility for VA benefits, you should see this change made in 1 to 2 months.')).toBeTruthy()
      })
    })
  })

  describe('when there is more than one allowed issue', () => {
    describe('when boardDecision is true', () => {
      it('should display "The judge granted the following issues:"', async () => {
        initializeTestInstance(
          [
            { description: 'desc', disposition: 'allowed' },
            { description: 'desc', disposition: 'allowed' },
          ],
          'vba',
          true,
          true,
        )
        expect(screen.getByText('The judge granted the following issues:')).toBeTruthy()
        expect(screen.getByText('If this decision changes your disability rating or your eligibility for VA benefits, you should see this change made in 1 to 2 months.')).toBeTruthy()
      })
    })

    describe('when boardDecision is false', () => {
      it('should display "The reviewer granted the following issues:"', async () => {
        initializeTestInstance(
          [
            { description: 'desc', disposition: 'allowed' },
            { description: 'desc', disposition: 'allowed' },
          ],
          'vba',
          true,
          false,
        )
        expect(screen.getByText('The reviewer granted the following issues:')).toBeTruthy()
      })
    })
  })

  describe('when there is only one allowed issue', () => {
    describe('when boardDecision is true', () => {
      it('should display "The judge granted the following issue:"', async () => {
        initializeTestInstance([{ description: 'desc', disposition: 'allowed' }], 'vba', true, true)
        expect(screen.getByText('The judge granted the following issue:')).toBeTruthy()
        expect(screen.getByText('If this decision changes your disability rating or your eligibility for VA benefits, you should see this change made in 1 to 2 months.')).toBeTruthy()
      })
    })

    describe('when boardDecision is false', () => {
      it('should display "The reviewer granted the following issue:"', async () => {
        initializeTestInstance([{ description: 'desc', disposition: 'allowed' }], 'vba', true, false)
        expect(screen.getByText('The reviewer granted the following issue:')).toBeTruthy()
      })
    })
  })

  describe('when there is more than one denied issue', () => {
    describe('when boardDecision is true', () => {
      it('should display "The judge denied the following issues:"', async () => {
        initializeTestInstance(
          [
            { description: 'desc', disposition: 'denied' },
            { description: 'desc', disposition: 'denied' },
          ],
          'vba',
          true,
          true,
        )
        expect(screen.getByText('The judge denied the following issues:')).toBeTruthy()
      })
    })

    describe('when boardDecision is false', () => {
      it('should display "The reviewer denied the following issues:"', async () => {
        initializeTestInstance(
          [
            { description: 'desc', disposition: 'denied' },
            { description: 'desc', disposition: 'denied' },
          ],
          'vba',
          true,
          false,
        )
        expect(screen.getByText('The reviewer denied the following issues:')).toBeTruthy()
      })
    })
  })

  describe('when there is only one denied issue', () => {
    describe('when boardDecision is true', () => {
      it('should display "The judge denied the following issue:"', async () => {
        initializeTestInstance([{ description: 'desc', disposition: 'denied' }], 'vba', true, true)
        expect(screen.getByText('The judge denied the following issue:')).toBeTruthy()
      })
    })

    describe('when boardDecision is false', () => {
      it('should display "The reviewer denied the following issue:"', async () => {
        initializeTestInstance([{ description: 'desc', disposition: 'denied' }], 'vba', true, false)
        expect(screen.getByText('The reviewer denied the following issue:')).toBeTruthy()
      })
    })
  })

  describe('when there is more than one remand issue', () => {
    describe('when ama is true', () => {
      it('should display "The judge is sending these issues back to the {{aojDesc}} to correct an error"', async () => {
        initializeTestInstance(
          [
            { description: 'desc', disposition: 'remand' },
            { description: 'desc', disposition: 'remand' },
          ],
          'vba',
          true,
          true,
        )
        expect(screen.getByText('The judge is sending these issues back to the Veterans Benefits Administration to correct an error')).toBeTruthy()
        expect(screen.getByText("After the Veterans Benefits Administration has completed the judge’s instructions to correct the error, they will make a new decision.")).toBeTruthy()
      })
    })

    describe('when ama is false', () => {
      it('should display "The judge is sending these issues back to the {{aojDesc}} to gather more evidence or to fix a mistake before deciding whether to grant or deny"', async () => {
        initializeTestInstance(
          [
            { description: 'desc', disposition: 'remand' },
            { description: 'desc', disposition: 'remand' },
          ],
          'vba',
          false,
          false,
        )
        expect(screen.getByText('The judge is sending these issues back to the Veterans Benefits Administration to gather more evidence or to fix a mistake before deciding whether to grant or deny')).toBeTruthy()
      })
    })
  })

  describe('when there is only one remand issue', () => {
    describe('when ama is true', () => {
      it('should display "The judge is sending this issue back to the {{aojDesc}} to correct an error"', async () => {
        initializeTestInstance([{ description: 'desc', disposition: 'remand' }], 'vba', true, true)
        expect(screen.getByText('The judge is sending this issue back to the Veterans Benefits Administration to correct an error')).toBeTruthy()
        expect(screen.getByText("After the Veterans Benefits Administration has completed the judge’s instructions to correct the error, they will make a new decision.")).toBeTruthy()
      })
    })

    describe('when ama is false', () => {
      it('should display "The judge is sending this issue back to the {{aojDesc}} to gather more evidence or to fix a mistake before deciding whether to grant or deny"', async () => {
        initializeTestInstance([{ description: 'desc', disposition: 'remand' }], 'vba', false, false)
        expect(screen.getByText('The judge is sending this issue back to the Veterans Benefits Administration to gather more evidence or to fix a mistake before deciding whether to grant or deny')).toBeTruthy()
      })
    })
  })
})
