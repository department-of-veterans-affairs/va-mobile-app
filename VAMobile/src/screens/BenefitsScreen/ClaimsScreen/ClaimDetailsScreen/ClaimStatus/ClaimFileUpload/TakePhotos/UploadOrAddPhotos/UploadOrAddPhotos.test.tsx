import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import UploadOrAddPhotos from './UploadOrAddPhotos'
import { claim as Claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import { InitialState } from 'store/slices'

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
  let request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
  }

  let firstImageResponse = {
    uri: 'uri',
  }

  const initializeTestInstance = () => {
    const props = mockNavProps(undefined, { addListener: jest.fn(), setOptions: jest.fn(), navigate: jest.fn() }, { params: { request, firstImageResponse } })
    render(<UploadOrAddPhotos {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          claim: Claim,
        },
      },
    })
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByRole('header', { name: 'Upload photos' })).toBeTruthy()
    expect(screen.getByText('Add photo')).toBeTruthy()
    expect(screen.getByText('of 10 photos')).toBeTruthy()
    expect(screen.getByText('0 Bytes of 50MB')).toBeTruthy()
    expect(screen.getByRole('spinbutton', { name: 'Document type (Required)' })).toBeTruthy()
    expect(screen.getByRole('checkbox')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Submit file' })).toBeTruthy()
  })
})
