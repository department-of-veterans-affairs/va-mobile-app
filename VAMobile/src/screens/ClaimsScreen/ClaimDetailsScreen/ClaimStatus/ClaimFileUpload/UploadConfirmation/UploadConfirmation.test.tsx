import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, mockNavProps, mockStore, render, RenderAPI } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'

import UploadConfirmation from './UploadConfirmation'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import { VAButton } from 'components'
import { uploadFileToClaim, InitialState } from 'store/slices'

jest.mock('store/slices/', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    uploadFileToClaim: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    fileUploadSuccess: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('UploadConfirmation', () => {
  let component: RenderAPI
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
    uploadsAllowed: true,
  }

  const initializeTestInstance = (filesUploadedSuccess = false, fileUploadedFailure = false) => {
    props = mockNavProps(undefined, { setOptions: jest.fn(), goBack: goBackSpy, navigate: navigateSpy }, { params: { request, filesList: ['file'] } })

    component = render(<UploadConfirmation {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          claim: Claim,
          filesUploadedSuccess,
          fileUploadedFailure,
        },
      },
    })

    testInstance = component.container
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

  describe('on click of the upload button', () => {
    it('should call uploadFileToClaim', async () => {
      testInstance.findAllByType(VAButton)[0].props.onPress()
      expect(uploadFileToClaim).toHaveBeenCalled()
    })
  })

  describe('when fileUploadedSuccess is true and there is no error', () => {
    it('should call navigation navigate to the upload success screen', async () => {
      initializeTestInstance(true)
      expect(navigateSpy).toHaveBeenCalledWith('UploadSuccess')
    })
  })

  describe('when the file fails to upload', () => {
    it('should call navigation navigate to the upload failure screen', async () => {
      initializeTestInstance(false, true)
      expect(navigateSpy).toHaveBeenCalledWith('UploadFailure')
    })
  })
})
