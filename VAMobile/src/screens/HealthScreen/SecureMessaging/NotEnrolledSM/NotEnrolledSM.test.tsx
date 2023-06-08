import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, findByTestID, render, RenderAPI, waitFor } from 'testUtils'
import NotEnrolledSM from './NotEnrolledSM'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('NotEnrolledSM', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<NotEnrolledSM />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when Learn how to upgrade link is clicked', () => {
    it('should launch external link', async () => {
      await waitFor(() => {
        findByTestID(testInstance, 'Learn how to upgrade to a My HealtheVet Premium account.').props.onPress()
      })
      expect(mockExternalLinkSpy).toBeCalledWith('https://www.myhealth.va.gov/web/myhealthevet/upgrading-your-my-healthevet-account-through-in-person-or-online-authentication')
    })
  })
})
