import React from 'react'
import { screen, fireEvent } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import AskForClaimDecision from './AskForClaimDecision'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState, submitClaimDecision } from 'store/slices'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { claim as Claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    submitClaimDecision: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('AskForClaimDecision', () => {
  let navigateSpy: any
  const initializeTestInstance = (submittedDecision: boolean, error?: Error, errorsState: ErrorsState = initialErrorsState, decisionLetterSent = true): void => {
    navigateSpy = jest.fn()
    const props = mockNavProps(
      undefined,
      {
        navigate: navigateSpy,
        goBack: jest.fn(),
      },
      {
        params: { claimID: 'id' },
      },
    )

    render(<AskForClaimDecision {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          submittedDecision,
          error,
          claim: {
            id: '600156928',
            type: 'evss_claims',
            attributes: {
              ...Claim.attributes,
              decisionLetterSent,
              open: false,
            },
          },
        },
        errors: errorsState,
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance(false)
  })

  it('should initialize', () => {
    expect(screen.getByText('Claim evaluation')).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Evaluation details' })).toBeTruthy()
    expect(screen.getByText("We sent you a letter in the mail asking for more evidence to support your claim. We’ll wait 30 days for your evidence. If you don’t have anything more you want to submit, let us know and we’ll go ahead and make a decision on your claim.")).toBeTruthy()
    expect(screen.getByText('Taking the full 30 days won’t affect:')).toBeTruthy()
    expect(screen.getByText('Whether you get VA benefits')).toBeTruthy()
    expect(screen.getByText('The payment amount')).toBeTruthy()
    expect(screen.getByText('Whether you get our help to gather evidence to support your claim')).toBeTruthy()
    expect(screen.getByText('The date benefits will begin if we approve your claim')).toBeTruthy()
    expect(screen.getByText("I have submitted all evidence that will support my claim and I’m not going to turn in any more information. I would like VA to make a decision on my claim based on the information already provided. (Required)")).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Request claim evaluation' })).toBeTruthy()
  })

  describe('on click of the back button', () => {
    describe('when submittedDecision is true and there is no error', () => {
      describe('if the claim is closed', () => {
        it('should call navigation navigate for the ClaimDetailsScreen with claimType set to CLOSED', () => {
          initializeTestInstance(true)
          expect(mockNavigationSpy).toHaveBeenCalledWith('ClaimDetailsScreen', { claimID: 'id', claimType: 'CLOSED', focusOnSnackbar: true })
        })
      })
    })

    describe('when submitted decision is false or there is an error', () => {
      it('should not call navigation go back', () => {
        initializeTestInstance(true, { name: 'ERROR', message: 'ERROR' })
        expect(navigateSpy).not.toHaveBeenCalledWith('ClaimDetailsScreen', { claimID: 'id', claimType: 'CLOSED', focusOnSnackbar: true })
      })
    })
  })

  describe('on click of submit', () => {
    describe('if the check box is not checked', () => {
      it('should display the field error', () => {
        fireEvent.press(screen.getByRole('button', { name: 'Request claim evaluation' }))
        expect(submitClaimDecision).not.toHaveBeenCalled()
        expect(screen.getByText('Check the box to confirm the information is correct.')).toBeTruthy()
      })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(false, undefined, errorState)
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })
})
