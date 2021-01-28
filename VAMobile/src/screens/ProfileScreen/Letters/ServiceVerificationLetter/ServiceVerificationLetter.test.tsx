import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { TouchableOpacity } from 'react-native'

import {context, mockStore, renderWithProviders} from 'testUtils'
import ServiceVerificationLetter from './ServiceVerificationLetter'
import { downloadLetter } from 'store/actions'
import { LetterTypeConstants } from 'store/api/types'
import { ErrorsState, initialErrorsState, initialLettersState, InitialState } from 'store/reducers'
import { ErrorComponent, LoadingComponent } from 'components';
import { CommonErrors } from 'constants/errors';
import { ScreenIDs } from 'constants/screens'

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


context('ServiceVerificationLetter', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (downloading = false, errorsState: ErrorsState = initialErrorsState) => {
    store = mockStore({
      ...InitialState,
      letters: {
        ...initialLettersState,
        downloading: downloading
      },
      errors: errorsState
    })

    act(() => {
      component = renderWithProviders(<ServiceVerificationLetter/>, store)
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

  describe('when view letter is pressed', () => {
    it('should call downloadLetter', async () => {
      testInstance.findByType(TouchableOpacity).props.onPress()
      expect(downloadLetter).toBeCalledWith(LetterTypeConstants.serviceVerification, undefined, ScreenIDs.SERVICE_VERIFICATION_LETTER_SCREEN_ID)
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDs.SERVICE_VERIFICATION_LETTER_SCREEN_ID,
        errorType: CommonErrors.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: "TEST_SCREEN_ID",
        errorType: CommonErrors.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
