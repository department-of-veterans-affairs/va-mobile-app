import React from 'react'
import { ImagePickerResponse } from 'react-native-image-picker'
import { screen, fireEvent } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import UploadFile from './UploadFile'
import { claim as Claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import { InitialState } from 'store/slices'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'

const mockAlertSpy = jest.fn()
const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
    useDestructiveActionSheet: () => mockAlertSpy,
  }
})

context('UploadFile', () => {
  let navigateToSpy: jest.Mock
  let request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
  }

  const initializeTestInstance = (imageUploaded?: ImagePickerResponse) => {
    navigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(navigateToSpy)

    const file = {
      name: 'File 1',
      size: 100,
    } as DocumentPickerResponse

    const props = mockNavProps(undefined, { addListener: jest.fn(), setOptions: jest.fn(), navigate: jest.fn() }, { params: { request, fileUploaded: file, imageUploaded } })

    render(<UploadFile {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          claim: Claim,
        },
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: 'Upload files' })).toBeTruthy()
    expect(screen.getByTestId('File 1 0.1 kilobytes')).toBeTruthy()
    expect(screen.getByTestId('Document type picker required')).toBeTruthy()
    expect(screen.getByLabelText('The file I uploaded is evidence for this claim. (Required) ')).toBeTruthy()
    expect(screen.getByText('Submit file')).toBeTruthy()
  })

  describe('on click of the upload button', () => {
    it('should display an error if the checkbox is not checked', () => {
      fireEvent.press(screen.getByTestId('Document type picker required'))
      fireEvent.press(screen.getByTestId('Civilian Police Reports'))
      fireEvent.press(screen.getByTestId('Done'))
      fireEvent.press(screen.getByTestId('Submit file'))
      expect(screen.getByText('Check the box to confirm the information is correct')).toBeTruthy()
      expect(mockAlertSpy).not.toHaveBeenCalled()
    })

    it('should bring up confirmation requirements are met', () => {
      fireEvent.press(screen.getByTestId('Document type picker required'))
      fireEvent.press(screen.getByTestId('Civilian Police Reports'))
      fireEvent.press(screen.getByTestId('Done'))
      fireEvent.press(screen.getByLabelText('The file I uploaded is evidence for this claim. (Required) '))
      fireEvent.press(screen.getByTestId('Submit file'))
      expect(mockAlertSpy).toHaveBeenCalled()
    })
  })
})
