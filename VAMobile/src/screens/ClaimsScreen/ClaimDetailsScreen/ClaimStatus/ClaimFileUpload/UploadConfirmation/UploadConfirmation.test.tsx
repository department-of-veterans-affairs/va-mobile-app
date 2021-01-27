import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import UploadConfirmation from './UploadConfirmation'
import {InitialState} from 'store/reducers'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import {VAButton} from 'components'

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

  const initializeTestInstance = (filesUploadedSuccess = false) => {
    props = mockNavProps(undefined, { setOptions: jest.fn(), goBack: goBackSpy, navigate: navigateSpy }, { params: { request, filesList: ['file'] } })

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: {
        ...InitialState.claimsAndAppeals,
        claim: Claim,
        filesUploadedSuccess,
      }
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
})
