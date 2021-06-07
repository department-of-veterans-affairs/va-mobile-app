import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import {Pressable} from 'react-native'
import {context, findByTestID, mockNavProps, mockStore, renderWithProviders} from 'testUtils'

import ClaimsAndAppealsListView, {ClaimType, ClaimTypeConstants} from './ClaimsAndAppealsListView'
import {InitialState} from 'store/reducers'
import { TextView } from 'components'
import {ClaimsAndAppealsList} from 'store/api/types'
import NoClaimsAndAppeals from '../NoClaimsAndAppeals/NoClaimsAndAppeals'
import { getClaimsAndAppeals } from 'store/actions/claimsAndAppeals'

let mockNavigationSpy = jest.fn()
jest.mock('../../../utils/hooks', () => {
  let original = jest.requireActual("../../../utils/hooks")
  let theme = jest.requireActual("../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => { return () => mockNavigationSpy},
  }
})

jest.mock('../../../store/actions/claimsAndAppeals', () => {
  let actual = jest.requireActual('../../../store/actions/claimsAndAppeals')
  return {
    ...actual,
    getClaimsAndAppeals: jest.fn(() => {
      return {
        type: '',
        payload: {}
      }
    })
  }
})

context('ClaimsAndAppealsListView', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (claimType: ClaimType, isEmpty?: boolean): void => {
    props = mockNavProps({ claimType })

    const activeClaimsAndAppeals: ClaimsAndAppealsList = [
      {
        id: '0',
        type: 'appeal',
        attributes: {
          subtype: 'supplementalClaim',
          completed: false,
          dateFiled: '2020-10-22',
          updatedAt: '2020-10-28T20:15:14.000+00:00',
        }
      },
      {
        id: '2',
        type: 'claim',
        attributes: {
          subtype: 'Compensation',
          completed: false,
          dateFiled: '2020-10-22',
          updatedAt: '2020-10-30T20:15:14.000+00:00',
        },
      },
    ]

    const closedClaimsAndAppeals: ClaimsAndAppealsList = [
      {
        id: '1',
        type: 'claim',
        attributes: {
          subtype: 'Compensation',
          completed: true,
          dateFiled: '2020-10-25',
          updatedAt: '2020-10-31T20:15:14.000+00:00',
        },
      },
    ]

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: {
        ...InitialState.claimsAndAppeals,
        claimsAndAppealsByClaimType: {
          ACTIVE: isEmpty ? [] : activeClaimsAndAppeals,
          CLOSED: isEmpty ? [] : closedClaimsAndAppeals,
        },
        claimsAndAppealsMetaPagination: {
          ACTIVE: {
            currentPage: 2,
            perPage: 1,
            totalEntries: 5
          },
          CLOSED: {
            currentPage: 2,
            perPage: 1,
            totalEntries: 5
          }
        }
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

    it('should display the second line as "Submitted on MMMM dd, yyyy', async () =>{
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Submitted October 22, 2020')
    })
  })

  describe('when an item is type appeal', () => {
    it('should display the first line with the format "{{subtype}} updated on MMMM, dd yyyy"', async () =>{
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Supplemental claim updated on October 28, 2020')
    })

    it('should display the second line as "Submitted on MMMM dd, yyyy', async () =>{
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Submitted October 22, 2020')
    })
  })


  describe('on click of a claim', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of an appeal', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[1].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('where there are no claims or appeals', () => {
    it('should display the NoClaimsAndAppeals components', async () => {
      initializeTestInstance('ACTIVE', true)
      expect(testInstance.findAllByType(NoClaimsAndAppeals).length).toEqual(1)
    })
  })

  describe('pagination', () => {
    it('should call getClaimsAndAppeals for previous arrow', async () => {
      findByTestID(testInstance, 'previous-page').props.onPress()
      // was 2 now 1
      expect(getClaimsAndAppeals).toHaveBeenCalledWith(ClaimTypeConstants.ACTIVE, expect.anything(), 1)
    })

    it('should call getClaimsAndAppeals for next arrow', async () => {
      findByTestID(testInstance, 'next-page').props.onPress()
      // was 2 now 3
      expect(getClaimsAndAppeals).toHaveBeenCalledWith(ClaimTypeConstants.ACTIVE, expect.anything(), 3)
    })
  })
})
