import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, mockNavProps, mockStore, render, RenderAPI } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'

import UploadOrAddPhotos from './UploadOrAddPhotos'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import { InitialState } from 'store/slices'
import { VAButton, VAModalPicker } from 'components'

const mockNavigationSpy = jest.fn()
jest.mock('../../../../../../../utils/hooks', () => {
  const original = jest.requireActual('../../../../../../../utils/hooks')
  const theme = jest.requireActual('../../../../../../../styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return () => mockNavigationSpy
    },
  }
})

context('UploadOrAddPhotos', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let store: any

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
    props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: jest.fn() }, { params: { request, firstImageResponse } })

    component = render(<UploadOrAddPhotos {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          claim: Claim,
        },
      },
    })

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the upload button', () => {
    it('should call useRouteNavigation', async () => {
      act(() => {
        testInstance.findByType(VAModalPicker).props.onSelectionChange('L228')
        testInstance.findAllByType(VAButton)[0].props.onPress()
      })

      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
