import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, findByTestID, findByTypeWithText, mockStore, render, RenderAPI } from 'testUtils'
import ProfileBanner from './ProfileBanner'
import { initialAuthorizedServicesState, initialDisabilityRatingState, InitialState } from 'store/slices'
import { TextView } from 'components'
import { ServiceData } from 'store/api/types'

context('ProfileBanner', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const prepInstanceWithStore = (mostRecentBranch?: string) => {
    component = render(<ProfileBanner />, {
      preloadedState: {
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
            signinService: 'IDME',
          },
        },
        militaryService: {
          ...InitialState.militaryService,
          mostRecentBranch: mostRecentBranch || 'United States Air Force',
          serviceHistory: [{} as ServiceData],
        },
        authorizedServices: {
          ...initialAuthorizedServicesState,
          militaryServiceHistory: true,
        },
        disabilityRating: {
          ...InitialState.disabilityRating,
          ratingData: {
            combinedDisabilityRating: 100,
            combinedEffectiveDate: '2013-08-09T00:00:00.000+00:00',
            legalEffectiveDate: '2013-08-09T00:00:00.000+00:00',
            individualRatings: [],
          },
        },
      },
    })

    testInstance = component.container
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

  describe('when the military branch is United States Coast Guard', () => {
    it('should display the Coastal_Guard component', async () => {
      prepInstanceWithStore('United States Coast Guard')

      const coastalGuard = findByTestID(testInstance, 'Coast-Guard')
      expect(coastalGuard).toBeTruthy()
    })
  })

  describe('when the military branch is United States Marine Corps', () => {
    it('should display the Marine_Corps component', async () => {
      prepInstanceWithStore('United States Marine Corps')

      const marineCorps = findByTestID(testInstance, 'Marine-Corps')
      expect(marineCorps).toBeTruthy()
    })
  })

  describe('when the military branch is United States Navy', () => {
    it('should display the Navy component', async () => {
      prepInstanceWithStore('United States Navy')

      const navy = findByTestID(testInstance, 'Navy')
      expect(navy).toBeTruthy()
    })
  })

  describe('when the service history is empty', () => {
    it('should not display the Branch name', async () => {
      component = render(<ProfileBanner />, {
        preloadedState: {
          ...InitialState,
          militaryService: {
            ...InitialState.militaryService,
            serviceHistory: [],
          },
          authorizedServices: {
            ...initialAuthorizedServicesState,
            militaryServiceHistory: true,
          },
        },
      })

      testInstance = component.container

      expect(testInstance.findAllByType(TextView)).toHaveLength(1)
    })
  })

  describe('when the user does not have militaryServiceHistory authorized service', () => {
    it('should not display the Branch name', async () => {
      component = render(<ProfileBanner />, {
        preloadedState: {
          ...InitialState,
          authorizedServices: {
            ...initialAuthorizedServicesState,
            militaryServiceHistory: false,
          },
        },
      })

      testInstance = component.container

      expect(testInstance.findAllByType(TextView)).toHaveLength(1)
    })
  })

  describe('disability rating', () => {
    it('should display the disability rating component', async () => {
      const disabilityRating = findByTypeWithText(testInstance, TextView, '100% service connected')
      const yourDisabilityRating = findByTypeWithText(testInstance, TextView, 'Your disability rating: ')

      expect(disabilityRating).toBeTruthy()
      expect(yourDisabilityRating).toBeTruthy()
    })

    it('should display the disability rating component', async () => {
      component = render(<ProfileBanner />, {
        preloadedState: {
          ...InitialState,
          militaryService: {
            ...InitialState.militaryService,
            mostRecentBranch: 'United States Air Force',
            serviceHistory: [{} as ServiceData],
          },
          authorizedServices: {
            ...initialAuthorizedServicesState,
            militaryServiceHistory: true,
          },
          disabilityRating: {
            ...initialDisabilityRatingState,
            ratingData: undefined,
          },
        },
      })

      testInstance = component.container
      expect(testInstance.findAllByType(TextView)).toHaveLength(2)
    })
  })
})
