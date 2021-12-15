import React from 'react'

import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'

import AskForClaimDecision from './AskForClaimDecision'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/reducers'
import { AlertBox, VASelector, ErrorComponent, VAButton, TextView } from 'components'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import { submitClaimDecision } from 'store/actions'

jest.mock('../../../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../../../store/actions')
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
  let component: any
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
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
            save: options.headerRight ? options.headerRight({}) : undefined,
          }
        },
        navigate: navigateSpy,
        goBack: goBackSpy,
      },
      {
        params: { claimID: 'id' },
      },
    )

    store = mockStore({
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
    })

    act(() => {
      component = renderWithProviders(<AskForClaimDecision {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(false)
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when submittedDecision is true and there is no error', () => {
    it('should display an AlertBox', async () => {
      initializeTestInstance(true, undefined)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(VASelector).length).toEqual(0)
    })
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
          navHeaderSpy.back.props.onPress()
          expect(navigateSpy).toHaveBeenCalledWith('ClaimDetailsScreen', { claimID: 'id', claimType: 'CLOSED' })
        })
      })

      describe('if the claim is open', () => {
        it('should call navigation navigate for the ClaimDetailsScreen with claimType set to ACTIVE', async () => {
          initializeTestInstance(true, undefined, initialErrorsState, false)
          navHeaderSpy.back.props.onPress()
          expect(navigateSpy).toHaveBeenCalledWith('ClaimDetailsScreen', { claimID: 'id', claimType: 'ACTIVE' })
        })
      })
    })

    describe('when submitted decision is false or there is an error', () => {
      it('should call navigation go back', async () => {
        navHeaderSpy.back.props.onPress()
        expect(goBackSpy).toHaveBeenCalled()

        initializeTestInstance(true, { name: 'ERROR', message: 'ERROR' })
        navHeaderSpy.back.props.onPress()
        expect(goBackSpy).toHaveBeenCalled()
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
        expect(textViews[textViews.length - 3].props.children).toEqual('Check to confirm the information is correct.')
      })
    })

    it('should call submitClaimDecision', async () => {
      act(() => {
        testInstance.findByType(VASelector).props.onSelectionChange(true)
        testInstance.findByType(VAButton).props.onPress()
      })

      expect(submitClaimDecision).toHaveBeenCalledWith('id', 'ASK_FOR_CLAIM_DECISION_SCREEN')
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        errorsByScreenID,
        tryAgain: () => Promise.resolve(),
      }

      initializeTestInstance(false, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        errorsByScreenID,
        tryAgain: () => Promise.resolve(),
      }

      initializeTestInstance(false, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
