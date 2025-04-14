import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import SelectFile from './SelectFile'

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

jest.mock('react-native-image-picker', () => {
  const original = jest.requireActual('react-native-image-picker')
  return {
    ...original,
    launchImageLibrary: jest.fn(),
  }
})

context('SelectFile', () => {
  const request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
  }

  const initializeTestInstance = () => {
    const props = mockNavProps(undefined, { addListener: jest.fn(), setOptions: jest.fn() }, { params: { request } })
    render(<SelectFile {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(
      screen.getByRole('header', { name: t('fileUpload.selectAFileToUpload', { requestTitle: 'the request' }) }),
    ).toBeTruthy()
    expect(
      screen.getByText(
        t('fileUpload.pleaseRequestFromPhoneFiles') +
          t('fileUpload.pleaseRequestFromPhoneFiles.bolded') +
          t('fileUpload.pleaseRequestFromPhoneFiles.pt2'),
      ),
    ).toBeTruthy()
    expect(screen.getByRole('header', { name: t('fileUpload.maxFileSize') })).toBeTruthy()
    expect(screen.getByText(t('fileUpload.50MB'))).toBeTruthy()
    expect(screen.getByRole('header', { name: t('fileUpload.acceptedFileTypes') })).toBeTruthy()
    expect(screen.getByText(t('fileUpload.acceptedFileTypeOptions'))).toBeTruthy()
    expect(screen.getByRole('button', { name: t('fileUpload.selectAFile') })).toBeTruthy()
  })

  describe('on click of select a file', () => {
    it('should call showActionSheetWithOptions and display the action sheet', () => {
      fireEvent.press(screen.getByRole('button', { name: t('fileUpload.selectAFile') }))
      expect(mockShowActionSheetWithOptions).toHaveBeenCalled()
      const actionSheetConfig = mockShowActionSheetWithOptions.mock.calls[0][0]
      expect(actionSheetConfig.options).toEqual(['File Folder', t('cancel')])
    })
  })
})
