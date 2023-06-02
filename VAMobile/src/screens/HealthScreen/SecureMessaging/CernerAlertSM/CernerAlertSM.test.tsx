import 'react-native'
import React from 'react'
import { act, ReactTestInstance } from 'react-test-renderer'

import { context, findByTypeWithSubstring, findByTypeWithText, render } from 'testUtils'
import CernerAlertSM from './CernerAlertSM'
import { initialPatientState, InitialState, PatientState } from 'store/slices'
import { TextView } from 'components'
import { Pressable, TouchableWithoutFeedback } from 'react-native'

const mockExternalLinkSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
  }
})

context('CernerAlertSM', () => {
  let component: any
  let testInstance: ReactTestInstance
  const mockPatientState: PatientState = {
    isCernerPatient: true,
    cernerFacilities: [
      {
        isCerner: true,
        facilityId: '1',
        facilityName: 'FacilityOne',
      },
    ],
    facilities: [
      {
        isCerner: true,
        facilityId: '1',
        facilityName: 'FacilityOne',
      },
      {
        isCerner: false,
        facilityId: '2',
        facilityName: 'FacilityTwo',
      },
    ],
  }

  const initializeTestInstance = (patient?: PatientState): void => {
    const mockPatient = patient || {}

    component = render(<CernerAlertSM />, {
      preloadedState: {
        ...InitialState,
        patient: {
          ...initialPatientState,
          ...mockPatient,
        },
      },
    })

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance(mockPatientState)
    act(() => {
      testInstance.findByType(Pressable).props.onPress()
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should only show cerner facilities, not other facilities', () => {
    expect(findByTypeWithSubstring(testInstance, TextView, 'FacilityOne')).toBeTruthy()
    expect(findByTypeWithSubstring(testInstance, TextView, 'FacilityTwo')).toBeFalsy()
  })

  it('should call mockExternalLinkSpy when link is selected', async () => {
    act(() => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
    })
    expect(mockExternalLinkSpy).toBeCalledWith('https://patientportal.myhealth.va.gov/')
  })

  describe('with one cerner facility', () => {
    it('should show single facility name', () => {
      expect(findByTypeWithText(testInstance, TextView, 'Sending a message to a provider at FacilityOne?')).toBeTruthy()
    })
  })

  describe('with multiple cerner facilities', () => {
    it('should show all facility names', () => {
      initializeTestInstance({
        isCernerPatient: true,
        cernerFacilities: [
          {
            isCerner: true,
            facilityId: '1',
            facilityName: 'FacilityOne',
          },
          {
            isCerner: true,
            facilityId: '2',
            facilityName: 'FacilityTwo',
          },
        ],
        facilities: [
          {
            isCerner: true,
            facilityId: '1',
            facilityName: 'FacilityOne',
          },
          {
            isCerner: true,
            facilityId: '2',
            facilityName: 'FacilityTwo',
          },
        ],
      })
      act(() => {
        testInstance.findByType(Pressable).props.onPress()
      })

      expect(findByTypeWithSubstring(testInstance, TextView, 'FacilityOne')).toBeTruthy()
      expect(findByTypeWithSubstring(testInstance, TextView, 'FacilityTwo')).toBeTruthy()
    })
  })
})
