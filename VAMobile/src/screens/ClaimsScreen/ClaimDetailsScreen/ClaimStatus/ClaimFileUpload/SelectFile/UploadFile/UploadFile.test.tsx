import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import { act } from 'react-test-renderer'

import UploadFile from './UploadFile'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import {InitialState} from 'store/reducers'
import {VAButton} from 'components'

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

context('UploadFile', () => {
  let component: any
  let testInstance: any
  let props: any
  let store: any

  let request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true
  }

  const initializeTestInstance = () => {
    props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: jest.fn() }, { params: { request } })

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: {
        ...InitialState.claimsAndAppeals,
        claim: Claim
      }
    })

    act(() => {
      component = renderWithProviders(<UploadFile {...props}/>, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the upload button', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(VAButton)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })
})
