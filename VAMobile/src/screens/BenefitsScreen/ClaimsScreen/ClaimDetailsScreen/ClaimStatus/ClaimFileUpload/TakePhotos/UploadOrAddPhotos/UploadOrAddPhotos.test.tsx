import 'react-native'
import React from 'react'

import { context, mockNavProps, render } from 'testUtils'
import { screen } from '@testing-library/react-native'
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

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(screen.getByText('Upload photos')).toBeTruthy()
    expect(screen.getByText('Add photo')).toBeTruthy()
    expect(screen.getByText('of 10 photos')).toBeTruthy()
    expect(screen.getByText('0 Bytes of 50MB')).toBeTruthy()
    expect(screen.getByTestId('Document type picker required')).toBeTruthy()
    expect(screen.getByRole('checkbox')).toBeTruthy()
    expect(screen.getByText('Submit file')).toBeTruthy()
  })
})
