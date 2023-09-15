import 'react-native'
import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'
import CernerAlertSM from './CernerAlertSM'
import { initialPatientState, InitialState, PatientState } from 'store/slices'

const mockExternalLinkSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('CernerAlertSM', () => {
  const mockSingleFacilityPatientState: PatientState = {
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
  const mockMultipleFacilityPatientState: PatientState = {
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
  }

  const initializeTestInstance = (patient?: PatientState): void => {
    const mockPatient = patient || {}

    render(<CernerAlertSM />, {
      preloadedState: {
        ...InitialState,
        patient: {
          ...initialPatientState,
          ...mockPatient,
        },
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance(mockSingleFacilityPatientState)
  })


  it('should only show cerner facilities, not other facilities', () => {
    expect(screen.getByText("Make sure you're in the right health portal")).toBeTruthy()
    fireEvent.press(screen.getByText("Make sure you're in the right health portal"))
    expect(screen.getByText("Sending a message to a care team at FacilityOne?")).toBeTruthy()
    expect(screen.queryByText("FacilityTwo")).toBeFalsy()
  })

  it('should call mockExternalLinkSpy when link is selected', async () => {
    fireEvent.press(screen.getByText("Make sure you're in the right health portal"))
    fireEvent.press(screen.getByText('Go to My VA Health'))
    expect(mockExternalLinkSpy).toBeCalledWith('https://patientportal.myhealth.va.gov/')
  })

  describe('with multiple cerner facilities', () => {
    it('should show all facility names', () => {
      initializeTestInstance(mockMultipleFacilityPatientState)
      fireEvent.press(screen.getByText("Make sure you're in the right health portal"))
      expect(screen.getByText("FacilityOne")).toBeTruthy()
      expect(screen.getByText("FacilityTwo")).toBeTruthy()
    })
  })
})
