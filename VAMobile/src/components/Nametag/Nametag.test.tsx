import 'react-native'
import React from 'react'
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import Nametag from './Nametag'
import { InitialState } from 'store/slices'
import { TextView, VAIcon } from 'components'
import { ServiceData } from 'store/api/types'


jest.mock('../../api/authorizedServices/getAuthorizedServices', () => {
  let original = jest.requireActual('../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
      status: "success",
      data: {
        appeals: true,
        appointments: true,
        claims: true,
        decisionLetters: true,
        directDepositBenefits: true,
        directDepositBenefitsUpdate: true,
        disabilityRating: true,
        genderIdentity: true,
        lettersAndDocuments: true,
        militaryServiceHistory: true,
        paymentHistory: true,
        preferredName: true,
        prescriptions: true,
        scheduleAppointments: true,
        secureMessaging: true,
        userProfileUpdate: true
      }
    })
  }
})

context('Nametag', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const prepInstanceWithStore = (mostRecentBranch?: string) => {
    component = render(<Nametag />, {
      preloadedState: {
        ...InitialState,
        militaryService: {
          ...InitialState.militaryService,
          mostRecentBranch: mostRecentBranch || 'United States Air Force',
          serviceHistory: [{} as ServiceData],
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

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    prepInstanceWithStore('United States Air Force')
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the military branch is United States Air Force', () => {
    it('should display the AirForce component', async () => {
      expect(testInstance.findAllByType(VAIcon)[0].props.name).toEqual('AirForce')
    })
  })

  describe('when the military branch is United States Army', () => {
    it('should display the Army component', async () => {
      prepInstanceWithStore('United States Army')
      expect(testInstance.findAllByType(VAIcon)[0].props.name).toEqual('Army')
    })
  })

  describe('when the military branch is United States Coast Guard', () => {
    it('should display the CoastGuard component', async () => {
      prepInstanceWithStore('United States Coast Guard')
      expect(testInstance.findAllByType(VAIcon)[0].props.name).toEqual('CoastGuard')
    })
  })

  describe('when the military branch is United States Marine Corps', () => {
    it('should display the MarineCorps component', async () => {
      prepInstanceWithStore('United States Marine Corps')
      expect(testInstance.findAllByType(VAIcon)[0].props.name).toEqual('MarineCorps')
    })
  })

  describe('when the military branch is United States Navy', () => {
    it('should display the Navy component', async () => {
      prepInstanceWithStore('United States Navy')
      expect(testInstance.findAllByType(VAIcon)[0].props.name).toEqual('Navy')
    })
  })

  describe('when the service history is empty', () => {
    it('should not display the Branch name', async () => {
      component = render(<Nametag />, {
        preloadedState: {
          ...InitialState,
          militaryService: {
            ...InitialState.militaryService,
            serviceHistory: [],
          },
        },
      })

      testInstance = component.UNSAFE_root

      expect(testInstance.findAllByType(TextView)).toHaveLength(1)
    })
  })

  describe('when the user does not have militaryServiceHistory authorized service', () => {
    it('should not display the Branch name', async () => {
      component = render(<Nametag />, {
        preloadedState: {
          ...InitialState,
        },
      })

      testInstance = component.UNSAFE_root

      expect(testInstance.findAllByType(TextView)).toHaveLength(1)
    })
  })
})
