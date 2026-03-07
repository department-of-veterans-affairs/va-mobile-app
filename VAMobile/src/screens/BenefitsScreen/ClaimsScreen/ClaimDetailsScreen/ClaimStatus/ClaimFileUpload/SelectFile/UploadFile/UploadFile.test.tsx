import React from 'react'
import { ImagePickerResponse } from 'react-native-image-picker'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import UploadFile from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/UploadFile/UploadFile'
import { claim as Claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import { QueriesData, context, mockNavProps, render } from 'testUtils'

const mockAlertSpy = jest.fn()
const mockNavigationSpy = jest.fn()
const mockMutate = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
    useShowActionSheet: () => mockAlertSpy,
  }
})

jest.mock('api/claimsAndAppeals', () => ({
  ...jest.requireActual('api/claimsAndAppeals'),
  useUploadFileToClaim: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}))

context('UploadFile', () => {
  let navigateToSpy: jest.Mock
  const request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
  }
  const renderWithData = (imageUploaded?: ImagePickerResponse, provider?: string): void => {
    navigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(navigateToSpy)

    const queriesData: QueriesData = [
      {
        queryKey: [claimsAndAppealsKeys.claim, '0'],
        data: {
          ...Claim,
        },
      },
    ]

    const file = {
      name: 'File 1',
      size: 100,
    } as DocumentPickerResponse

    const props = mockNavProps(
      undefined,
      { addListener: jest.fn(), setOptions: jest.fn(), navigate: jest.fn() },
      { params: { claimID: '0', request, fileUploaded: file, imageUploaded, provider } },
    )

    render(<UploadFile {...props} />, { queriesData })
  }

  it('initializes correctly', () => {
    renderWithData()
    expect(screen.getByRole('header', { name: t('fileUpload.uploadFiles') })).toBeTruthy()
    expect(screen.getByTestId('File 1 0.1 kilobytes')).toBeTruthy()
    expect(screen.getByLabelText('Document type picker required')).toBeTruthy()
    expect(screen.getByLabelText(t('fileUpload.evidenceOnly'))).toBeTruthy()
    expect(screen.getByText(t('fileUpload.submit'))).toBeTruthy()
  })

  describe('on click of the upload button', () => {
    beforeEach(() => {
      renderWithData()
    })

    it('should display an error if the checkbox is not checked', async () => {
      fireEvent.press(screen.getByRole('spinbutton', { name: 'Document type picker required' }))
      await waitFor(() => {
        fireEvent.press(screen.getByRole('link', { name: 'Civilian Police Reports' }))
      })
      fireEvent.press(screen.getByRole('button', { name: t('done') }))
      fireEvent.press(screen.getByRole('button', { name: t('fileUpload.submit') }))
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox.props).toBeTruthy()
      expect(mockAlertSpy).not.toHaveBeenCalled()
    })

    it('should bring up confirmation requirements are met', async () => {
      fireEvent.press(screen.getByRole('spinbutton', { name: 'Document type picker required' }))
      await waitFor(() => {
        fireEvent.press(screen.getByRole('link', { name: 'Civilian Police Reports' }))
      })
      fireEvent.press(screen.getByRole('button', { name: t('done') }))
      fireEvent.press(screen.getByLabelText(t('fileUpload.evidenceOnly')))
      fireEvent.press(screen.getByRole('button', { name: t('fileUpload.submit') }))
      expect(mockAlertSpy).toHaveBeenCalled()
    })
  })

  describe('navigation after successful upload', () => {
    const fillAndSubmitForm = async () => {
      fireEvent.press(screen.getByRole('spinbutton', { name: 'Document type picker required' }))
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Civilian Police Reports' })))
      fireEvent.press(screen.getByRole('button', { name: t('done') }))
      fireEvent.press(screen.getByLabelText(t('fileUpload.evidenceOnly')))
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('fileUpload.submit') })))
    }

    beforeEach(() => {
      mockNavigationSpy.mockReset()
      mockAlertSpy.mockImplementation((_: unknown, callback: (idx: number) => void) => callback(0))
      mockMutate.mockImplementation((_: unknown, options: { onSuccess: () => void }) => options.onSuccess())
    })

    it('navigates to ClaimDetailsScreen with provider when provider param is set', async () => {
      renderWithData(undefined, 'lighthouseV2')
      await fillAndSubmitForm()
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('ClaimDetailsScreen', {
          claimID: '0',
          claimType: 'ACTIVE',
          provider: 'lighthouseV2',
        }),
      )
    })

    it('navigates to ClaimDetailsScreen without provider when provider param is not set', async () => {
      renderWithData()
      await fillAndSubmitForm()
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('ClaimDetailsScreen', {
          claimID: '0',
          claimType: 'ACTIVE',
          provider: undefined,
        }),
      )
    })
  })
})
