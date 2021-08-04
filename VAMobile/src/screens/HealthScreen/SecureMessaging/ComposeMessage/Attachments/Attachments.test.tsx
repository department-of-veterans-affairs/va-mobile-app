import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import DocumentPicker from 'react-native-document-picker'
import {ImagePickerResponse} from 'react-native-image-picker'

import {context, mockNavProps, renderWithProviders} from 'testUtils'
import Attachments from './Attachments'
import {AlertBox, TextView, VAButton} from 'components'
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
jest.mock('utils/hooks', () => {
  let original = jest.requireActual("utils/hooks")
  let theme = jest.requireActual("styles/themes/standardTheme").default
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

  const initializeTestInstance = (attachmentsList: Array<ImagePickerResponse | DocumentPickerResponse> = []) => {
    goBack = jest.fn()

    props = mockNavProps(undefined, { setOptions: jest.fn(), goBack }, { params: { attachmentsList } })

    act(() => {
      component = renderWithProviders(<Attachments {...props}/>)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
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
    it('should replace the select a file button with the attach and cancel buttons and display the file name', async () => {
      const promise = Promise.resolve({uri: 'uri', name: 'custom-file-name.docx', type: 'docx', size: 100000, } as DocumentPickerResponse)
      jest.spyOn(DocumentPicker, 'pick').mockReturnValue(promise)

      const buttons = testInstance.findAllByType(VAButton)
      expect(buttons.length).toEqual(1)
      expect(buttons[0].props.label).toEqual('Select a File')

      buttons[0].props.onPress()

      const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

      act(() => {
        actionSheetCallback(2)
      })

      await act(() => {
        promise
      })

      const allButtons = testInstance.findAllByType(VAButton)
      expect(allButtons.length).toEqual(2)
      expect(allButtons[0].props.label).toEqual('Attach')
      expect(allButtons[1].props.label).toEqual('Cancel')

      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('custom-file-name.docx (0.1 MB)')
    })

    describe('on click of the attach button', () => {
      it('should call useRouteNavigation', async () => {
        const promise = Promise.resolve({uri: 'uri', name: 'custom-file-name.docx', type: 'docx' } as DocumentPickerResponse)
        jest.spyOn(DocumentPicker, 'pick').mockReturnValue(promise)

        const buttons = testInstance.findAllByType(VAButton)
        expect(buttons.length).toEqual(1)
        expect(buttons[0].props.label).toEqual('Select a File')

        buttons[0].props.onPress()

        const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

        act(() => {
          actionSheetCallback(2)
        })

        await act(() => {
          promise
        })

        testInstance.findAllByType(VAButton)[0].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })

    describe('on click of the cancel button', () => {
      it('should call navigation go back', async () => {
        const promise = Promise.resolve({uri: 'uri', name: 'custom-file-name.docx', type: 'docx' } as DocumentPickerResponse)
        jest.spyOn(DocumentPicker, 'pick').mockReturnValue(promise)

        const buttons = testInstance.findAllByType(VAButton)
        expect(buttons.length).toEqual(1)
        expect(buttons[0].props.label).toEqual('Select a File')

        buttons[0].props.onPress()

        const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

        act(() => {
          actionSheetCallback(2)
        })

        await act(() => {
          promise
        })

        testInstance.findAllByType(VAButton)[1].props.onPress()
        expect(goBack).toHaveBeenCalled()
      })
    })

    describe('when there is an error from the file selection', () => {
      it('should display an AlertBox', async () => {
        const failCasePromise = Promise.resolve({uri: 'uri', name: 'custom-file-name.docx', type: 'docx', size: 90000000 } as DocumentPickerResponse)
        jest.spyOn(DocumentPicker, 'pick').mockReturnValue(failCasePromise)

        const allButtons = testInstance.findAllByType(VAButton)
        expect(allButtons[0].props.label).toEqual('Select a File')

        allButtons[0].props.onPress()

        const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

        act(() => {
          actionSheetCallback(2)
        })

        await act(() => {
          failCasePromise
        })

        expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      })

      describe('when the error is a file type error', () => {
        it('should display the file type error message', async () => {
          const failCasePromise = Promise.resolve({uri: 'uri', name: 'custom-file-name.docx', type: 'error' } as DocumentPickerResponse)
          jest.spyOn(DocumentPicker, 'pick').mockReturnValue(failCasePromise)

          const allButtons = testInstance.findAllByType(VAButton)
          expect(allButtons[0].props.label).toEqual('Select a File')

          allButtons[0].props.onPress()

          const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

          act(() => {
            actionSheetCallback(2)
          })

          await act(() => {
            failCasePromise
          })

          expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('The file type you are trying to upload is not allowed. Please confirm that your file is one of the following formats: doc, docx, gif, jpg, pdf, png, rtf, txt, xls, xlsx.')
        })
      })

      describe('when the error is a file size error', () => {
        it('should display the file size error message', async () => {
          const failCasePromise = Promise.resolve({uri: 'uri', name: 'custom-file-name.docx', type: 'docx', size: 90000000 } as DocumentPickerResponse)
          jest.spyOn(DocumentPicker, 'pick').mockReturnValue(failCasePromise)

          const allButtons = testInstance.findAllByType(VAButton)
          expect(allButtons[0].props.label).toEqual('Select a File')

          allButtons[0].props.onPress()

          const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

          act(() => {
            actionSheetCallback(2)
          })

          await act(() => {
            failCasePromise
          })

          expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('The file you are trying to upload exceeds the 3 MB limit. Please reduce the file size and try again.')
        })
      })

      describe('when the error is a sum of files size error', () => {
        it('should display the sum of file size error message', async () => {
          initializeTestInstance([{ size: 6291456 } as DocumentPickerResponse])

          const failCasePromise = Promise.resolve({uri: 'uri', name: 'custom-file-name.docx', type: 'docx', size: 1000 } as DocumentPickerResponse)
          jest.spyOn(DocumentPicker, 'pick').mockReturnValue(failCasePromise)

          const allButtons = testInstance.findAllByType(VAButton)
          expect(allButtons[0].props.label).toEqual('Select a File')

          allButtons[0].props.onPress()

          const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

          act(() => {
            actionSheetCallback(2)
          })

          await act(() => {
            failCasePromise
          })

          expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('The sum of the file(s) you are trying to upload exceeds the 6 MB limit. Please reduce the file(s) size and try again.')
        })
      })

      describe('when the error is duplicate file error', () => {
        it('should display the sum of file size error message', async () => {
          initializeTestInstance([{ uri: 'uri1', name: 'name' } as DocumentPickerResponse])

          const failCasePromise = Promise.resolve({uri: 'uri1', name: 'custom-file-name.docx', type: 'docx', size: 1000 } as DocumentPickerResponse)
          jest.spyOn(DocumentPicker, 'pick').mockReturnValue(failCasePromise)

          const allButtons = testInstance.findAllByType(VAButton)
          expect(allButtons[0].props.label).toEqual('Select a File')

          allButtons[0].props.onPress()

          const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

          act(() => {
            actionSheetCallback(2)
          })

          await act(() => {
            failCasePromise
          })

          expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('File already uploaded. Please select a different file.')
        })
      })
    })
  })
})
