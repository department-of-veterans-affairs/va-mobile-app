import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import {Pressable} from 'react-native'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import ClaimsAndAppealsListView, {ClaimType} from './ClaimsAndAppealsListView'
import {InitialState} from 'store/reducers'
import {TextView} from 'components'

let mockNavigationSpy = jest.fn()
jest.mock('../../../utils/hooks', () => {
  let original = jest.requireActual("../../../utils/hooks")
  let theme = jest.requireActual("../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('ClaimsAndAppealsListView', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (claimType: ClaimType): void => {
    props = mockNavProps({ claimType })

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: {
        ...InitialState.claimsAndAppeals,
        activeOrClosedClaimsAndAppeals: [
          {
            id: '0',
            type: 'appeal',
            attributes: {
              subtype: 'Compensation',
              completed: false,
              dateFiled: '2020-10-22T20:15:14.000+00:00',
              updatedAt: '2020-10-28T20:15:14.000+00:00',
            }
          },
          {
            id: '1',
            type: 'claim',
            attributes: {
              subtype: 'Compensation',
              completed: true,
              dateFiled: '2020-10-22T20:15:14.000+00:00',
              updatedAt: '2020-10-30T20:15:14.000+00:00',
            },
          },
          {
            id: '2',
            type: 'claim',
            attributes: {
              subtype: 'Disability',
              completed: false,
              dateFiled: '2020-10-25T20:15:14.000+00:00',
              updatedAt: '2020-10-31T20:15:14.000+00:00',
            },
          },
        ]
      }
    })

    act(() => {
      component = renderWithProviders(<ClaimsAndAppealsListView {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance('ACTIVE')
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the claimType is ACTIVE', () => {
    it('should display the header as "Your active claims and appeals"', async () => {
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Your active claims and appeals')
    })
  })

  describe('when the claimType is CLOSED', () => {
    it('should display the header as "Your closed claims and appeals"', async () => {
      initializeTestInstance('CLOSED')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Your closed claims and appeals')
    })
  })

  describe('when an item is type claim', () => {
    it('should display the first line with the format "Claim for {{subtype}} updated on MMMM, dd yyyy"', async () =>{
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Claim for compensation updated on October 30, 2020')
    })
  })

  describe('when an item is type appeal', () => {
    it('should display the first line with the format "{{subtype}} appeal updated on MMMM, dd yyyy"', async () =>{
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Compensation appeal updated on October 28, 2020')
    })
  })

  describe('on click of a claim', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalledWith('ClaimDetails', { claimID: '2', claimType: 'ACTIVE' })
    })
  })
})
