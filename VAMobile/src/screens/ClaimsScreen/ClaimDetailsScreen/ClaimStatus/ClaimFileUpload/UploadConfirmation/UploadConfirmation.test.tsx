import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import UploadConfirmation from './UploadConfirmation'
import { ErrorsState, initialErrorsState, InitialState } from 'store/reducers'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import { ErrorComponent, VAButton } from 'components'
import { CommonErrors } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

context('UploadConfirmation', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let store: any
  let goBackSpy = jest.fn()
  let navigateSpy = jest.fn()

  let request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true
  }

  const initializeTestInstance = (filesUploadedSuccess = false, errorsState: ErrorsState = initialErrorsState) => {
    props = mockNavProps(undefined, { setOptions: jest.fn(), goBack: goBackSpy, navigate: navigateSpy }, { params: { request, filesList: ['file'] } })

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: {
        ...InitialState.claimsAndAppeals,
        claim: Claim,
        filesUploadedSuccess,
      },
      errors: errorsState
    })

    act(() => {
      component = renderWithProviders(<UploadConfirmation {...props}/>, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the cancel button', () => {
    it('should call navigation go back', async () => {
      testInstance.findAllByType(VAButton)[1].props.onPress()
      expect(goBackSpy).toHaveBeenCalled()
    })
  })

  describe('when fileUploadedSuccess is true and there is no error', () => {
    it('should call navigation navigate', async () => {
      initializeTestInstance(true)
      expect(navigateSpy).toHaveBeenCalled()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.CLAIM_UPLOAD_CONFIRMATION_SCREEN_ID,
        errorType: CommonErrors.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: undefined,
        errorType: CommonErrors.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
