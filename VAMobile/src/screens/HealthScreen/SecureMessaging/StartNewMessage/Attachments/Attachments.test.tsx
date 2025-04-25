import React from 'react'
import DocumentPicker from 'react-native-document-picker'
import { ImagePickerResponse } from 'react-native-image-picker'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { context, mockNavProps, render, waitFor } from 'testUtils'

import Attachments from './Attachments'

const mockShowActionSheetWithOptions = jest.fn()
jest.mock('@expo/react-native-action-sheet', () => {
  const original = jest.requireActual('@expo/react-native-action-sheet')
  return {
    ...original,
    useActionSheet: () => {
      return { showActionSheetWithOptions: mockShowActionSheetWithOptions }
    },
  }
})

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
    useBeforeNavBackListener: jest.fn(),
  }
})

context('Attachments', () => {
  let goBack: jest.Mock

  const initializeTestInstance = (attachmentsList: Array<ImagePickerResponse | DocumentPickerResponse> = []) => {
    goBack = jest.fn()

    const props = mockNavProps(undefined, { setOptions: jest.fn(), goBack }, { params: { attachmentsList } })

    render(<Attachments {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  afterEach(() => {
    mockShowActionSheetWithOptions.mockClear()
  })

  describe('on click of select a file', () => {
    it('should call showActionSheetWithOptions and display the action sheet', async () => {
      await waitFor(() => {
        fireEvent.press(screen.getByText(t('secureMessaging.attachments.selectAFile')))

        expect(mockShowActionSheetWithOptions).toHaveBeenCalled()

        const actionSheetConfig = mockShowActionSheetWithOptions.mock.calls[0][0]
        expect(actionSheetConfig.options).toEqual(['Camera', 'Photo Gallery', 'File Folder', 'Cancel'])
      })
    })
  })

  describe('when an image or file is selected', () => {
    it('should replace the select a file button with the attach button and display the file name', async () => {
      const promise = Promise.resolve({
        uri: 'uri',
        name: 'custom-file-name.docx',
        type: 'docx',
        size: 100000,
      } as DocumentPickerResponse)
      jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(promise)

      fireEvent.press(screen.getByText(t('secureMessaging.attachments.selectAFile')))

      const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]
      actionSheetCallback(2)

      await waitFor(() => {
        promise
      })

      expect(screen.getByRole('button', { name: t('secureMessaging.startNewMessage.attach') })).toBeTruthy()
      expect(screen.getByLabelText('custom-file-name.docx (0.1 megabytes)')).toBeTruthy()
    })

    describe('on click of the attach button', () => {
      it('should call useRouteNavigation', async () => {
        const promise = Promise.resolve({
          uri: 'uri',
          name: 'custom-file-name.docx',
          type: 'docx',
        } as DocumentPickerResponse)
        jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(promise)

        fireEvent.press(screen.getByRole('button', { name: t('secureMessaging.attachments.selectAFile') }))

        const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

        await waitFor(() => {
          actionSheetCallback(2)
        })

        await waitFor(() => {
          promise
        })
        fireEvent.press(screen.getByRole('button', { name: t('secureMessaging.startNewMessage.attach') }))
        expect(mockNavigationSpy).toHaveBeenCalledWith('EditDraft', {
          attachmentFileToAdd: { name: 'custom-file-name.docx', type: 'docx', uri: 'uri' },
          attachmentFileToRemove: {},
          messageID: undefined,
        })
      })
    })

    describe('when there is an error from the file selection', () => {
      it('should display an AlertBox', async () => {
        const failCasePromise = Promise.resolve({
          uri: 'uri',
          name: 'custom-file-name.docx',
          type: 'docx',
          size: 90000000,
        } as DocumentPickerResponse)
        jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(failCasePromise)

        fireEvent.press(screen.getByRole('button', { name: t('secureMessaging.attachments.selectAFile') }))

        const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

        await waitFor(() => {
          actionSheetCallback(2)
        })

        await waitFor(() => {
          failCasePromise
        })

        expect(screen.getByText(t('secureMessaging.attachments.fileSizeError'))).toBeTruthy()
      })

      describe('when the error is a file type error', () => {
        it('should display the file type error message', async () => {
          const failCasePromise = Promise.resolve({
            uri: 'uri',
            name: 'custom-file-name.docx',
            type: 'error',
          } as DocumentPickerResponse)
          jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(failCasePromise)

          fireEvent.press(screen.getByRole('button', { name: t('secureMessaging.attachments.selectAFile') }))

          const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

          await waitFor(() => {
            actionSheetCallback(2)
          })

          await waitFor(() => {
            failCasePromise
          })

          expect(screen.getByText(t('secureMessaging.attachments.fileTypeError'))).toBeTruthy()
        })
      })

      describe('when the error is a file size error', () => {
        it('should display the file size error message', async () => {
          const failCasePromise = Promise.resolve({
            uri: 'uri',
            name: 'custom-file-name.docx',
            type: 'docx',
            size: 90000000,
          } as DocumentPickerResponse)
          jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(failCasePromise)

          fireEvent.press(screen.getByRole('button', { name: t('secureMessaging.attachments.selectAFile') }))

          const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

          await waitFor(() => {
            actionSheetCallback(2)
          })

          await waitFor(() => {
            failCasePromise
          })

          expect(screen.getByText(t('secureMessaging.attachments.fileSizeError'))).toBeTruthy()
        })
      })

      describe('when the error is a sum of files size error', () => {
        it('should display the sum of file size error message', async () => {
          initializeTestInstance([{ size: 10485760 } as DocumentPickerResponse])

          const failCasePromise = Promise.resolve({
            uri: 'uri',
            name: 'custom-file-name.docx',
            type: 'docx',
            size: 1000,
          } as DocumentPickerResponse)
          jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(failCasePromise)

          fireEvent.press(screen.getByRole('button', { name: t('secureMessaging.attachments.selectAFile') }))

          const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

          await waitFor(() => {
            actionSheetCallback(2)
          })

          await waitFor(() => {
            failCasePromise
          })

          expect(screen.getByText(t('secureMessaging.attachments.fileSumSizeError'))).toBeTruthy()
        })
      })

      describe('when the error is duplicate file error', () => {
        it('should display the sum of file size error message', async () => {
          initializeTestInstance([{ uri: 'uri1', name: 'name' } as DocumentPickerResponse])

          const failCasePromise = Promise.resolve({
            uri: 'uri1',
            name: 'custom-file-name.docx',
            type: 'docx',
            size: 1000,
          } as DocumentPickerResponse)
          jest.spyOn(DocumentPicker, 'pickSingle').mockReturnValue(failCasePromise)

          fireEvent.press(screen.getByRole('button', { name: t('secureMessaging.attachments.selectAFile') }))

          const actionSheetCallback = mockShowActionSheetWithOptions.mock.calls[0][1]

          await waitFor(() => {
            actionSheetCallback(2)
          })

          await waitFor(() => {
            failCasePromise
          })

          expect(screen.getByText(t('secureMessaging.attachments.duplicateFileError'))).toBeTruthy()
        })
      })
    })
  })
})
