import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import { fireEvent, screen } from '@testing-library/react-native'

import DocumentPicker from 'react-native-document-picker'
import { ImagePickerResponse } from 'react-native-image-picker'

import { context, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import Attachments from './Attachments'
import { AlertBox, TextView, VAButton } from 'components'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { when } from 'jest-when'

let mockShowActionSheetWithOptions = jest.fn()
jest.mock('@expo/react-native-action-sheet', () => {
  let original = jest.requireActual('@expo/react-native-action-sheet')
  return {
    ...original,
    useActionSheet: () => {
      return { showActionSheetWithOptions: mockShowActionSheetWithOptions }
    },
  }
})

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
    useBeforeNavBackListener: jest.fn(),
  }
})

context('Attachments', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let goBack: jest.Mock
  let mockNavigateToEditDraftSpy: jest.Mock

  const initializeTestInstance = (attachmentsList: Array<ImagePickerResponse | DocumentPickerResponse> = []) => {
    goBack = jest.fn()
    mockNavigateToEditDraftSpy = jest.fn()

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('EditDraft', { attachmentFileToAdd: { name: 'custom-file-name.docx', type: 'docx', uri: 'uri' }, attachmentFileToRemove: {}, messageID: undefined })
      .mockReturnValue(mockNavigateToEditDraftSpy)

    props = mockNavProps(undefined, { setOptions: jest.fn(), goBack }, { params: { attachmentsList } })

    component = render(<Attachments {...props} />)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  afterEach(() => {
    mockShowActionSheetWithOptions.mockClear()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('on click of select a file', () => {
    it('should call showActionSheetWithOptions and display the action sheet', async () => {
      await waitFor(() => {
        fireEvent.press(screen.getByText('Select a file'))

        expect(mockShowActionSheetWithOptions).toHaveBeenCalled()

        const actionSheetConfig = mockShowActionSheetWithOptions.mock.calls[0][0]
        expect(actionSheetConfig.options).toEqual(['Camera', 'Photo Gallery', 'File Folder', 'Cancel'])
      })
    })
  })

  describe('when an image or file is selected', () => {
    it('should replace the select a file button with the attach button and display the file name', async () => {
      const promise = Promise.resolve({ uri: 'uri', name: 'custom-file-name.docx', type: 'docx', size: 100000 } as DocumentPickerResponse)
      jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(promise)

      fireEvent.press(screen.getByText('Select a file'))

      const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]
      actionSheetCallback(2)

      await waitFor(() => {
        promise
      })
      
      expect(screen.getByLabelText('Attach')).toBeTruthy()
      expect(screen.getByLabelText('custom-file-name.docx (0.1 megabytes)')).toBeTruthy()
    })
    
    describe('on click of the attach button', () => {
      it('should call useRouteNavigation', async () => {
        const promise = Promise.resolve({ uri: 'uri', name: 'custom-file-name.docx', type: 'docx' } as DocumentPickerResponse)
        jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(promise)

        const buttons = testInstance.findAllByType(VAButton)
        expect(buttons.length).toEqual(1)
        expect(buttons[0].props.label).toEqual('Select a file')

        await waitFor(() => {
          buttons[0].props.onPress()
        })

        const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

        await waitFor(() => {
          actionSheetCallback(2)
        })

        await waitFor(() => {
          promise
        })

        testInstance.findAllByType(VAButton)[0].props.onPress()
        expect(mockNavigateToEditDraftSpy).toHaveBeenCalled()
      })
    })

    describe('when there is an error from the file selection', () => {
      it('should display an AlertBox', async () => {
        const failCasePromise = Promise.resolve({ uri: 'uri', name: 'custom-file-name.docx', type: 'docx', size: 90000000 } as DocumentPickerResponse)
        jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(failCasePromise)

        const allButtons = testInstance.findAllByType(VAButton)
        expect(allButtons[0].props.label).toEqual('Select a file')

        await waitFor(() => {
          allButtons[0].props.onPress()
        })

        const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

        await waitFor(() => {
          actionSheetCallback(2)
        })

        await waitFor(() => {
          failCasePromise
        })

        expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      })

      describe('when the error is a file type error', () => {
        it('should display the file type error message', async () => {
          const failCasePromise = Promise.resolve({ uri: 'uri', name: 'custom-file-name.docx', type: 'error' } as DocumentPickerResponse)
          jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(failCasePromise)

          const allButtons = testInstance.findAllByType(VAButton)
          expect(allButtons[0].props.label).toEqual('Select a file')

          await waitFor(() => {
            allButtons[0].props.onPress()
          })

          const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

          await waitFor(() => {
            actionSheetCallback(2)
          })

          await waitFor(() => {
            failCasePromise
          })

          expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Attach a DOC, DOCX, GIF, PDF, JPG, PNG, RTF, TXT, XLS, or XLSX')
        })
      })

      describe('when the error is a file size error', () => {
        it('should display the file size error message', async () => {
          const failCasePromise = Promise.resolve({ uri: 'uri', name: 'custom-file-name.docx', type: 'docx', size: 90000000 } as DocumentPickerResponse)
          jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(failCasePromise)

          const allButtons = testInstance.findAllByType(VAButton)
          expect(allButtons[0].props.label).toEqual('Select a file')

          await waitFor(() => {
            allButtons[0].props.onPress()
          })

          const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

          await waitFor(() => {
            actionSheetCallback(2)
          })

          await waitFor(() => {
            failCasePromise
          })

          expect(testInstance.findAllByType(TextView)[2].props.children).toEqual(`Attach a file that's smaller than 6 MB`)
        })
      })

      describe('when the error is a sum of files size error', () => {
        it('should display the sum of file size error message', async () => {
          initializeTestInstance([{ size: 10485760 } as DocumentPickerResponse])

          const failCasePromise = Promise.resolve({ uri: 'uri', name: 'custom-file-name.docx', type: 'docx', size: 1000 } as DocumentPickerResponse)
          jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(failCasePromise)

          const allButtons = testInstance.findAllByType(VAButton)
          expect(allButtons[0].props.label).toEqual('Select a file')

          await waitFor(() => {
            allButtons[0].props.onPress()
          })

          const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

          await waitFor(() => {
            actionSheetCallback(2)
          })

          await waitFor(() => {
            failCasePromise
          })

          expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('The total size of your attachments must be smaller than 10 MB')
        })
      })

      describe('when the error is duplicate file error', () => {
        it('should display the sum of file size error message', async () => {
          initializeTestInstance([{ uri: 'uri1', name: 'name' } as DocumentPickerResponse])

          const failCasePromise = Promise.resolve({ uri: 'uri1', name: 'custom-file-name.docx', type: 'docx', size: 1000 } as DocumentPickerResponse)
          jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(failCasePromise)

          const allButtons = testInstance.findAllByType(VAButton)
          expect(allButtons[0].props.label).toEqual('Select a file')

          await waitFor(() => {
            allButtons[0].props.onPress()
          })

          const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

          await waitFor(() => {
            actionSheetCallback(2)
          })

          await waitFor(() => {
            failCasePromise
          })

          expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('You already attached this file')
        })
      })
    })
  })
})
