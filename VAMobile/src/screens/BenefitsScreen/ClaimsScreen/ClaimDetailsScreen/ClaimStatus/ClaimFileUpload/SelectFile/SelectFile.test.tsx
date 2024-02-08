import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

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
    expect(screen.getByRole('header', { name: 'Select a file to upload for the request' })).toBeTruthy()
    expect(
      screen.getByText(
        "To submit evidence that supports this claim, please select a file from your phone's files. You can only submit 1 file with this request.",
      ),
    ).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Maximum file size:' })).toBeTruthy()
    expect(screen.getByText('50 MB')).toBeTruthy()
    expect(screen.getByRole('header', { name: 'Accepted file types:' })).toBeTruthy()
    expect(screen.getByText('PDF (unlocked), GIF, JPEG, JPG, BMP, TXT')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Select a file' })).toBeTruthy()
  })

  describe('on click of select a file', () => {
    it('should call showActionSheetWithOptions and display the action sheet', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Select a file' }))
      expect(mockShowActionSheetWithOptions).toHaveBeenCalled()
      const actionSheetConfig = mockShowActionSheetWithOptions.mock.calls[0][0]
      expect(actionSheetConfig.options).toEqual(['File Folder', 'Cancel'])
    })
  })
})
