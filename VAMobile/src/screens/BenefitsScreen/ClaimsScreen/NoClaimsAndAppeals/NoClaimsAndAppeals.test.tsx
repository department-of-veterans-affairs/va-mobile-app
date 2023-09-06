import 'react-native'
import React from 'react'

// Note: test renderer must be required after react-native.
import { context, render, RenderAPI, waitFor } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'

import NoClaimsAndAppeals from './NoClaimsAndAppeals'
import { InitialState } from 'store/slices'
import { TextView } from 'components'
import { ClaimTypeConstants } from '../ClaimsAndAppealsListView/ClaimsAndAppealsListView'

context('NoClaimsAndAppeals', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = async (claimsServiceError = false, appealsServiceError = false) => {
    await waitFor(() => {
      component = render(<NoClaimsAndAppeals claimType={ClaimTypeConstants.ACTIVE} />, {
        preloadedState: {
          ...InitialState,
          claimsAndAppeals: {
            ...InitialState.claimsAndAppeals,
            claimsServiceError,
            appealsServiceError,
          },
        },
      })
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(async () => {
    await initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when there is a claimsServiceError', () => {
    beforeEach(async () => {
      await initializeTestInstance(true)
    })

    it('should display "You don\'t have any appeals" for the header', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual("You don't have any appeals")
    })

    it('should mention appeals in the text', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('This app shows only completed applications but you don’t have active appeals.')
    })
  })

  describe('when there is a appealsServiceError', () => {
    beforeEach(async () => {
      await initializeTestInstance(false, true)
    })

    it('should display "You don\'t have any submitted claims" for the header', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual("You don't have any submitted claims")
    })

    it('should mention claims in the text', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual(
        'This app shows only completed claim applications. If you started a claim but haven’t finished it yet, go to eBenefits to work on it.',
      )
    })
  })

  describe('when there is no claimsServiceError or appealsServiceError', () => {
    it('should display "You don\'t have any submitted claims or appeals" for the header', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual("You don't have any submitted claims or appeals")
    })

    it('should mention both claims and appeals in the text', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual(
        'This app shows only completed claim and appeal applications. If you started a claim or appeal but haven’t finished it yet, go to eBenefits to work on it.',
      )
    })
  })
})
