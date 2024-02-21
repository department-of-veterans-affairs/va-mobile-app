import React from 'react'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'

import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { context, fireEvent, render, screen } from 'testUtils'

import FileList from './FileList'

import Mock = jest.Mock

const mockAlertSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useDestructiveActionSheet: () => mockAlertSpy,
  }
})

context('FileList', () => {
  let onDeleteSpy: Mock

  const imageFile = {
    assets: [
      {
        fileName: 'Image file',
        fileSize: 100,
      },
    ],
  } as ImagePickerResponse

  const file = {
    name: 'File 1',
    size: 100,
  } as DocumentPickerResponse

  const initializeTestInstance = (useImage = false) => {
    onDeleteSpy = jest.fn(() => {})

    let files: ImagePickerResponse[] | DocumentPickerResponse[]

    if (useImage) {
      files = [imageFile]
    } else {
      files = [file]
    }

    render(<FileList files={files} onDelete={onDeleteSpy} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('should display a file', async () => {
    expect(screen.getByTestId('File 1 0.1 kilobytes')).toBeTruthy()
  })

  it('should display an image file', async () => {
    initializeTestInstance(true)
    expect(screen.getByTestId('Image file 0.1 kilobytes')).toBeTruthy()
  })

  it('should call the alert when the button is pressed', async () => {
    expect(screen.getByTestId('File 1 0.1 kilobytes')).toBeTruthy()
    fireEvent.press(screen.getByTestId('File 1 0.1 kilobytes'))
    expect(mockAlertSpy).toBeCalled()
  })
})
