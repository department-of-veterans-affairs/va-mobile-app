import React from 'react'

import { screen } from '@testing-library/react-native'

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
    expect(screen.getByRole('header', { name: 'Upload photos' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Add photo' })).toBeTruthy()
    expect(screen.getByText('of 10 photos')).toBeTruthy()
    expect(screen.getByText('0 Bytes of 50MB')).toBeTruthy()
    expect(screen.getByRole('spinbutton', { name: 'Document type (Required)' })).toBeTruthy()
    expect(screen.getByRole('checkbox')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Submit file' })).toBeTruthy()
  })
})
