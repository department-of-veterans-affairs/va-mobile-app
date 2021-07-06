import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import UploadFile from './UploadFile'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import {InitialState} from 'store/reducers'
import {TextView, VAButton, VAModalPicker} from 'components'
import {DocumentPickerResponse} from '../../../../../ClaimsStackScreens'
import {ImagePickerResponse} from 'react-native-image-picker'

const mockNavigationSpy = jest.fn()
jest.mock('../../../../../../../utils/hooks', () => {
  const original = jest.requireActual('../../../../../../../utils/hooks')
  const theme = jest.requireActual('../../../../../../../styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return () => mockNavigationSpy
    },
  }
})

context('UploadFile', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let store: any

  let request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true
  }

  const initializeTestInstance = (fileUploaded?: DocumentPickerResponse, imageUploaded?: ImagePickerResponse) => {
    props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: jest.fn() }, { params: { request, fileUploaded, imageUploaded } })

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: {
        ...InitialState.claimsAndAppeals,
        claim: Claim
      }
    })

    act(() => {
      component = renderWithProviders(<UploadFile {...props}/>, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the upload button', () => {
    it('should call useRouteNavigation', async () => {
      act(() => {
        testInstance.findByType(VAModalPicker).props.onSelectionChange('L228')
        testInstance.findAllByType(VAButton)[0].props.onPress()
      })

      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when a file is uploaded', () => {
    it('should display the uploaded file name', async () => {
      initializeTestInstance({ name: 'uploadedFile',  uri: '', copyError: '', fileCopyUri: '', size: 10, type: 'pdf' })
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('uploadedFile')
    })
  })

  describe('when an image is uploaded', () => {
    it('should display the uploaded image name', async () => {
      initializeTestInstance(undefined, { fileName: 'uploadedImage' })
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('uploadedImage')
    })
  })
})
