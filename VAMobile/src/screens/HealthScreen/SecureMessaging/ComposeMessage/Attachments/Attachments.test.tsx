import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import DocumentPicker from 'react-native-document-picker'

import {context, mockNavProps, renderWithProviders} from 'testUtils'
import Attachments from './Attachments'
import {TextView, VAButton} from 'components'
import {DocumentPickerResponse} from 'screens/ClaimsScreen/ClaimsStackScreens'

let mockShowActionSheetWithOptions = jest.fn()
jest.mock('@expo/react-native-action-sheet', () => {
  let original = jest.requireActual('@expo/react-native-action-sheet')
  return {
    ...original,
    useActionSheet: () => { return { showActionSheetWithOptions: mockShowActionSheetWithOptions }}
  }
})

let mockNavigationSpy = jest.fn()
jest.mock('../../../../../utils/hooks', () => {
  let original = jest.requireActual("../../../../../utils/hooks")
  let theme = jest.requireActual("../../../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => { return () => mockNavigationSpy},
  }
})


context('Attachments', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let goBack: jest.Mock

  beforeEach(() => {
    goBack = jest.fn()

    props = mockNavProps(undefined, { setOptions: jest.fn(), goBack })

    act(() => {
      component = renderWithProviders(<Attachments {...props}/>)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of select a file', () => {
    it('should call showActionSheetWithOptions and display the action sheet', async () => {
      testInstance.findByType(VAButton).props.onPress()

      expect(mockShowActionSheetWithOptions).toHaveBeenCalled()

      const actionSheetConfig = mockShowActionSheetWithOptions.mock.calls[0][0];
      expect(actionSheetConfig.options).toEqual([
        'Camera',
        'Photo gallery',
        'File folder',
        'Cancel',
      ]);
    })
  })

  describe('when an image or file is selected', () => {
    let promise: Promise<DocumentPickerResponse>
    let buttons
    beforeEach(async () => {
      promise = Promise.resolve({uri: 'uri', name: 'custom-file-name.docx', type: 'docx' } as DocumentPickerResponse)
      jest.spyOn(DocumentPicker, 'pick').mockReturnValue(promise)

      buttons = testInstance.findAllByType(VAButton)
      expect(buttons.length).toEqual(1)
      expect(buttons[0].props.label).toEqual('Select a file')

      buttons[0].props.onPress()

      const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

      act(() => {
        actionSheetCallback(2)
      })

      await act(() => {
        promise
      })
    })

    it('should replace the select a file button with the attach and cancel buttons and display the file name', async () => {
      buttons = testInstance.findAllByType(VAButton)
      expect(buttons.length).toEqual(2)
      expect(buttons[0].props.label).toEqual('Attach')
      expect(buttons[1].props.label).toEqual('Cancel')

      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('custom-file-name.docx')
    })

    describe('on click of the attach button', () => {
      it('should call useRouteNavigation', async () => {
        testInstance.findAllByType(VAButton)[0].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })

    describe('on click of the cancel button', () => {
      it('should call navigation go back', async () => {
        testInstance.findAllByType(VAButton)[1].props.onPress()
        expect(goBack).toHaveBeenCalled()
      })
    })
  })
})
