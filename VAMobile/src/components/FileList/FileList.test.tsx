import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { act, ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock
import { context, findByTestID, render, RenderAPI, waitFor } from 'testUtils'
import FileList from './FileList'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'

const mockAlertSpy = jest.fn()

jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useDestructiveActionSheet: () => mockAlertSpy,
  }
})

context('FileList', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
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

    component = render(<FileList files={files} onDelete={onDeleteSpy} />)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should display a file', async () => {
    expect(findByTestID(testInstance, 'File 1 0.1 kilobytes')).toBeTruthy()
  })

  it('should display an image file', async () => {
    initializeTestInstance(true)
    expect(findByTestID(testInstance, 'Image file 0.1 kilobytes')).toBeTruthy()
  })

  it('should call the alert when the button is pressed', async () => {
    await waitFor(() => {
      expect(findByTestID(testInstance, 'File 1 0.1 kilobytes')).toBeTruthy()
      findByTestID(testInstance, 'File 1 0.1 kilobytes').props.onPress()
      expect(mockAlertSpy).toBeCalled()
    })
  })
})
