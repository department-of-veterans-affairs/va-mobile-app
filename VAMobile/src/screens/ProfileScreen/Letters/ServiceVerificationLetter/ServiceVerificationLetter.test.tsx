import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { TouchableOpacity } from 'react-native'

import {context, mockStore, renderWithProviders} from 'testUtils'
import ServiceVerificationLetter from './ServiceVerificationLetter'
import { downloadLetter } from 'store/actions'
import { LetterTypeConstants } from 'store/api/types'
import { initialLettersState, InitialState } from 'store/reducers'
import { LoadingComponent } from 'components';

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

  const initializeTestInstance = (downloading = false) => {
    store = mockStore({
      ...InitialState,
      letters: {
        ...initialLettersState,
        downloading: downloading
      }
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
      expect(downloadLetter).toBeCalledWith(LetterTypeConstants.serviceVerification)
    })
  })
})
