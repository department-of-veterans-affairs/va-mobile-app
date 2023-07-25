import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'

import UploadOrAddPhotos from './UploadOrAddPhotos'
import { claim as Claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import { InitialState } from 'store/slices'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('UploadOrAddPhotos', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let navigateToSpy: jest.Mock

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
    navigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(navigateToSpy)
    props = mockNavProps(undefined, { addListener: jest.fn(), setOptions: jest.fn(), navigate: jest.fn() }, { params: { request, firstImageResponse } })

    component = render(<UploadOrAddPhotos {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          claim: Claim,
        },
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
