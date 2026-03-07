import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import UploadOrAddPhotos from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/UploadOrAddPhotos/UploadOrAddPhotos'
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

context('UploadOrAddPhotos', () => {
  const request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
  }

  const firstImageResponse = {
    uri: 'uri',
  }

  const renderWithData = (provider?: string): void => {
    const queriesData: QueriesData = [
      {
        queryKey: [claimsAndAppealsKeys.claim, '0'],
        data: {
          ...Claim,
        },
      },
    ]

    const props = mockNavProps(
      undefined,
      { addListener: jest.fn(), setOptions: jest.fn(), navigate: jest.fn() },
      { params: { claimID: '0', request, firstImageResponse, provider } },
    )

    render(<UploadOrAddPhotos {...props} />, { queriesData })
  }

  it('initializes correctly', () => {
    renderWithData()
    expect(screen.getByRole('header', { name: t('fileUpload.uploadPhotos') })).toBeTruthy()
    expect(screen.getByRole('button', { name: t('fileUpload.addPhoto') })).toBeTruthy()
    expect(screen.getByText(t('fileUpload.ofTenPhotos', { numOfPhotos: '' }))).toBeTruthy()
    expect(screen.getByText(t('fileUpload.ofFiftyMB', { sizeOfPhotos: `0 ${t('Bytes')}` }))).toBeTruthy()
    expect(screen.getByRole('spinbutton', { name: `${t('fileUpload.documentType')} ${t('required')}` })).toBeTruthy()
    expect(screen.getByRole('checkbox')).toBeTruthy()
    expect(screen.getByRole('button', { name: t('fileUpload.submit') })).toBeTruthy()
  })

  describe('navigation after successful upload', () => {
    const fillAndSubmitForm = async () => {
      fireEvent.press(screen.getByRole('spinbutton', { name: `${t('fileUpload.documentType')} ${t('required')}` }))
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Civilian Police Reports' })))
      fireEvent.press(screen.getByRole('button', { name: t('done') }))
      fireEvent.press(screen.getByRole('checkbox'))
      await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('fileUpload.submit') })))
    }

    beforeEach(() => {
      mockNavigationSpy.mockReset()
      mockAlertSpy.mockImplementation((_: unknown, callback: (idx: number) => void) => callback(0))
      mockMutate.mockImplementation((_: unknown, options: { onSuccess: () => void }) => options.onSuccess())
    })

    it('navigates to ClaimDetailsScreen with provider when provider param is set', async () => {
      renderWithData('lighthouseV2')
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
