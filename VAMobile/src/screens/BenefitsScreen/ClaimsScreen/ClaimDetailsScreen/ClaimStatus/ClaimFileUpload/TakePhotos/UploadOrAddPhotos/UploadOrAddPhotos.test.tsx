import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { claim as Claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import { QueriesData, context, mockNavProps, render } from 'testUtils'

import UploadOrAddPhotos from './UploadOrAddPhotos'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

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

  const renderWithData = (): void => {
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
      { params: { claimID: '0', request, firstImageResponse } },
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
})
