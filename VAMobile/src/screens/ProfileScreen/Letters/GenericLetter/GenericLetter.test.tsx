import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import {TouchableOpacity} from 'react-native'

import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import {LetterTypeConstants, LetterTypes, ScreenIDTypes} from 'store/api/types'
import { ErrorsState, initialErrorsState, initialLettersState, InitialState } from 'store/reducers'
import {AlertBox, ErrorComponent, LoadingComponent} from 'components'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import GenericLetter from './GenericLetter'
import {downloadLetter} from 'store/actions'

jest.mock('../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../store/actions')
  return {
    ...actual,
    downloadLetter: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    })
  }
})

context('GenericLetter', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let props: any

  const initializeTestInstance = (downloading = false, errorsState: ErrorsState = initialErrorsState, letterType: LetterTypes = LetterTypeConstants.commissary, screenID: ScreenIDTypes = ScreenIDTypesConstants.COMMISSARY_LETTER_SCREEN_ID ) => {
    store = mockStore({
      ...InitialState,
      letters: {
        ...initialLettersState,
        downloading: downloading
      },
      errors: errorsState
    })

    props = mockNavProps(undefined, undefined, { params: { header: 'header', description: 'desc', letterType, screenID } })

    act(() => {
      component = renderWithProviders(<GenericLetter {...props}/>, store)
    })

    testInstance = component.root
  }


  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when downloading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.COMMISSARY_LETTER_SCREEN_ID,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: undefined,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })

  describe('when view letter is pressed', () => {
    it('should call downloadLetter with the given letter type and screen ID', async () => {
      initializeTestInstance(false, undefined, LetterTypeConstants.minimumEssentialCoverage, ScreenIDTypesConstants.PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE_LETTER_SCREEN_ID)
      testInstance.findByType(TouchableOpacity).props.onPress()
      expect(downloadLetter).toBeCalledWith(LetterTypeConstants.minimumEssentialCoverage, undefined, ScreenIDTypesConstants.PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE_LETTER_SCREEN_ID)
    })
  })

  describe('when the letter type is service verification', () => {
    it('should display an alert box', async () => {
      initializeTestInstance(false, undefined, LetterTypeConstants.serviceVerification, ScreenIDTypesConstants.SERVICE_VERIFICATION_LETTER_SCREEN_ID)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
    })
  })
})
