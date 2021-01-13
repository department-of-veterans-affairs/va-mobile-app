import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'

import {TestProviders, context, findByTestID, mockStore, renderWithProviders} from 'testUtils'
import ProfileBanner from './ProfileBanner'
import { InitialState } from 'store/reducers'

context('ProfileBanner', () => {
  let component: any
  let store: any
  let testInstance: ReactTestInstance

  const prepInstanceWithStore = (mostRecentBranch?: string) => {
    store = mockStore({
      ...InitialState,
      personalInformation: {
        ...InitialState.personalInformation,
        profile: {
          firstName: 'Ben',
          middleName: 'J',
          lastName: 'Morgan',
          fullName: 'Jerry Mills',
          contactEmail: { emailAddress: 'ben@gmail.com', id: '0' },
          signinEmail: 'ben@gmail.com',
          birthDate: '1990-05-08',
          gender: 'M',
          addresses: '',
          homePhoneNumber: {
            id: 1,
            areaCode: '858',
            countryCode: '1',
            phoneNumber: '6901289',
            phoneType: 'HOME',
          },
          formattedHomePhone: '(858)-690-1289',
          mobilePhoneNumber: {
            id: 1,
            areaCode: '858',
            countryCode: '1',
            phoneNumber: '6901288',
            phoneType: 'HOME',
          },
          formattedMobilePhone: '(858)-690-1288',
          workPhoneNumber: {
            id: 1,
            areaCode: '858',
            countryCode: '1',
            phoneNumber: '6901287',
            phoneType: 'HOME',
          },
          formattedWorkPhone: '(858)-690-1287',
          faxNumber: {
            id: 1,
            areaCode: '858',
            countryCode: '1',
            phoneNumber: '6901286',
            phoneType: 'HOME',
          },
          formattedFaxPhone: '(858)-690-1286',
        }},
      militaryService: {
        ...InitialState.militaryService,
        mostRecentBranch: mostRecentBranch || 'United States Air Force',
      }
    })

    act(() => {
      component = renderWithProviders(
          <ProfileBanner />, store
      )
    })

    testInstance = component.root
  }

  beforeEach(() => {
    prepInstanceWithStore('United States Air Force')
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the military branch is United States Air Force', () => {
    it('should display the Air_Force component', async () => {
      const airForce = findByTestID(testInstance, 'Airforce')
      expect(airForce).toBeTruthy()
    })
  })

  describe('when the military branch is United States Army', () => {
    it('should display the Army component', async () => {
      prepInstanceWithStore('United States Army')

      const army = findByTestID(testInstance, 'Army')
      expect(army).toBeTruthy()
    })
  })

  describe('when the military branch is United States Coastal Guard', () => {
    it('should display the Coastal_Guard component', async () => {
      prepInstanceWithStore('United States Coastal Guard')

      const coastalGuard = findByTestID(testInstance, 'Coast-Guard')
      expect(coastalGuard).toBeTruthy()
    })
  })

  describe('when the military branch is United States Marine Corps', () => {
    it('should display the Marine_Corps component', async () => {
      prepInstanceWithStore('United States Marine Corps')

      testInstance = component.root
      const marineCorps = findByTestID(testInstance, 'Marine-Corps')
      expect(marineCorps).toBeTruthy()
    })
  })

  describe('when the military branch is United States Navy', () => {
    it('should display the Navy component', async () => {
      prepInstanceWithStore('United States Navy')

      testInstance = component.root
      const navy = findByTestID(testInstance, 'Navy')
      expect(navy).toBeTruthy()
    })
  })
})
