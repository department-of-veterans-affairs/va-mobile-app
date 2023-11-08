import 'react-native'
import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'
import CernerAlertSM from './CernerAlertSM'

const mockExternalLinkSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

jest.mock('../../../../api/facilities/getFacilitiesInfo', () => {
  let original = jest.requireActual('../../../../api/facilities/getFacilitiesInfo')
  return {
    ...original,
    useFacilitiesInfo: jest.fn().mockReturnValueOnce({
      status: "success",
      data: [
        {
          id: "358",
          name: "FacilityOne",
          city: "Cheyenne",
          state: "WY",
          cerner: true,
          miles: "3.17"
        },
        {
          id: "359",
          name: "FacilityTwo",
          city: "Cheyenne",
          state: "WY",
          cerner: true,
          miles: "3.17"
        }
      ]
    }).mockReturnValueOnce({
      status: "success",
      data: [
        {
          id: "358",
          name: "FacilityOne",
          city: "Cheyenne",
          state: "WY",
          cerner: true,
          miles: "3.17"
        },
        {
          id: "359",
          name: "FacilityTwo",
          city: "Cheyenne",
          state: "WY",
          cerner: false,
          miles: "3.17"
        }
      ]
    }),
  }
})

context('CernerAlertSM', () => {
  const initializeTestInstance = (): void => {
    render(<CernerAlertSM />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('with multiple cerner facilities', () => {
    it('should show all facility names', () => {
      fireEvent.press(screen.getByText("Make sure you're in the right health portal"))
      expect(screen.getByText("FacilityOne")).toBeTruthy()
      expect(screen.getByText("FacilityTwo")).toBeTruthy()
    })
  })

  it('should only show cerner facilities, not other facilities and should call mockExternalLinkSpy when link is selected', () => {
    expect(screen.getByText("Make sure you're in the right health portal")).toBeTruthy()
    fireEvent.press(screen.getByText("Make sure you're in the right health portal"))
    expect(screen.getByText("Sending a message to a care team at FacilityOne?")).toBeTruthy()
    expect(screen.queryByText("FacilityTwo")).toBeFalsy()

    fireEvent.press(screen.getByText('Go to My VA Health'))
    expect(mockExternalLinkSpy).toBeCalledWith('https://patientportal.myhealth.va.gov/')
  })
})
