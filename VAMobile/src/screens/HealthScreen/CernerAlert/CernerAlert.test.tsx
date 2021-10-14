import 'react-native'
import React from 'react'
import {act, ReactTestInstance} from 'react-test-renderer'

import {
  context,
  findByTypeWithSubstring,
  mockStore,
  renderWithProviders
} from 'testUtils'
import CernerAlert from './CernerAlert'
import {initialPatientState, InitialState, PatientState} from 'store/reducers'
import { TextView } from 'components'
import { Pressable, TouchableWithoutFeedback } from "react-native";

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

context('CernerAlert', () => {
  let component: any
  let testInstance: ReactTestInstance
  const mockPatientState: PatientState = {
    isCernerPatient: true,
    cernerFacilities: [
      {
        isCerner: true,
        facilityId: '1',
        facilityName: 'FacilityOne'
      },
    ],
    facilities: [
      {
        isCerner: true,
        facilityId: '1',
        facilityName: 'FacilityOne'
      },
      {
        isCerner: false,
        facilityId: '2',
        facilityName: 'FacilityTwo'
      }
    ]
  }

  const initializeTestInstance = (patient?: PatientState): void => {
    const mockPatient = patient || {}
    const store = mockStore({
      ...InitialState,
      patient: {
        ...initialPatientState,
        ...mockPatient
      }
    })

    act(() => {
      component = renderWithProviders(<CernerAlert />, store)
    })

    testInstance = component.root
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

  it('should only show cerner facilities', () => {
    expect(findByTypeWithSubstring(testInstance,TextView, 'FacilityOne')).toBeTruthy()
    expect(findByTypeWithSubstring(testInstance,TextView, 'FacilityTwo')).toBeFalsy()
  })

  it('should call mockExternalLinkSpy when link is selected', async () => {
    act(() => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
    })
    expect(mockExternalLinkSpy).toBeCalledWith('https://patientportal.myhealth.va.gov/')
  })
})
