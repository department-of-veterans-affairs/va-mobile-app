import React from 'react'

import { context, mockNavProps, render } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'

import AskForClaimDecision from './AskForClaimDecision'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState, submitClaimDecision } from 'store/slices'
import { AlertBox, VASelector, ErrorComponent, VAButton, TextView } from 'components'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { claim as Claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import { RenderAPI } from '@testing-library/react-native'

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
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let store: any
  let navHeaderSpy: any
  let navigateSpy: any
  let goBackSpy: any

  const initializeTestInstance = (submittedDecision: boolean, error?: Error, errorsState: ErrorsState = initialErrorsState, decisionLetterSent = true): void => {
    navigateSpy = jest.fn()
    goBackSpy = jest.fn()

    props = mockNavProps(
      undefined,
      {
        navigate: navigateSpy,
        goBack: goBackSpy,
      },
      {
        params: { claimID: 'id' },
      },
    )

    component = render(<AskForClaimDecision {...props} />, {
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

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance(false)
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when submittedDecision is false', () => {
    it('should display an VASelector', async () => {
      expect(testInstance.findAllByType(VASelector).length).toEqual(1)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(0)
    })
  })

  describe('on click of the back button', () => {
    describe('when submittedDecision is true and there is no error', () => {
      describe('if the claim is closed', () => {
        it('should call navigation navigate for the ClaimDetailsScreen with claimType set to CLOSED', async () => {
          initializeTestInstance(true)

          expect(navigateSpy).toHaveBeenCalledWith('ClaimDetailsScreen', { claimID: 'id', claimType: 'CLOSED', focusOnSnackbar: true })
        })
      })
    })

    describe('when submitted decision is false or there is an error', () => {
      it('should not call navigation go back', async () => {
        initializeTestInstance(true, { name: 'ERROR', message: 'ERROR' })
        expect(navigateSpy).not.toHaveBeenCalledWith('ClaimDetailsScreen', { claimID: 'id', claimType: 'CLOSED', focusOnSnackbar: true })
      })
    })
  })

  describe('on click of submit', () => {
    describe('if the check box is not checked', () => {
      it('should display the field error', async () => {
        act(() => {
          testInstance.findByType(VASelector).props.onSelectionChange(false)
          testInstance.findByType(VAButton).props.onPress()
        })

        expect(submitClaimDecision).not.toHaveBeenCalled()
        const textViews = testInstance.findAllByType(TextView)
        expect(textViews[textViews.length - 3].props.children).toEqual('Check the box to confirm the information is correct.')
      })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(false, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(false, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
