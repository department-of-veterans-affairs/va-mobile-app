import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import {context, renderWithProviders, mockStore} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import NoClaimsAndAppeals from './NoClaimsAndAppeals'
import {InitialState} from 'store/reducers'
import {TextView} from 'components'

context('NoClaimsAndAppeals', () => {
  let component: any
  let testInstance: ReactTestInstance
  let store: any

  const initializeTestInstance = (claimsServiceError = false, appealsServiceError = false): void => {
    store = mockStore({
      ...InitialState,
      claimsAndAppeals: {
        ...InitialState.claimsAndAppeals,
        claimsServiceError,
        appealsServiceError
      }
    })

    act(() => {
      component = renderWithProviders(<NoClaimsAndAppeals/>, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
   initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when there is a claimsServiceError', () => {
    beforeEach(() => {
      initializeTestInstance(true)
    })

    it('should display "You don\'t have any appeals" for the header', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('You don\'t have any appeals')
    })

    it('should mention appeals in the text', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('This app shows only completed applications but you don’t have active appeals.')
    })
  })

  describe('when there is a appealsServiceError', () => {
    beforeEach(() => {
      initializeTestInstance(false, true)
    })

    it('should display "You don\'t have any submitted claims" for the header', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('You don\'t have any submitted claims')
    })

    it('should mention claims in the text', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('This app shows only completed claim applications. If you started a claim but haven’t finished it yet, go to eBenefits to work on it.')
    })
  })

  describe('when there is no claimsServiceError or appealsServiceError', () => {
    it('should display "You don\'t have any submitted claims or appeals" for the header', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('You don\'t have any submitted claims or appeals')
    })

    it('should mention both claims and appeals in the text', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('This app shows only completed claim and appeal applications. If you started a claim or appeal but haven’t finished it yet, go to eBenefits to work on it.')
    })
  })
})
