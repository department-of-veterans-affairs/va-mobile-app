import React from 'react'
import { Alert } from 'react-native'

import { context, fireEvent, render, screen } from 'testUtils'

import CernerAlertSM from './CernerAlertSM'

jest.mock('../../../../api/facilities/getFacilitiesInfo', () => {
  const original = jest.requireActual('../../../../api/facilities/getFacilitiesInfo')
  return {
    ...original,
    useFacilitiesInfo: jest
      .fn()
      .mockReturnValueOnce({
        status: 'success',
        data: [
          {
            id: '358',
            name: 'FacilityOne',
            city: 'Cheyenne',
            state: 'WY',
            cerner: true,
            miles: '3.17',
          },
          {
            id: '359',
            name: 'FacilityTwo',
            city: 'Cheyenne',
            state: 'WY',
            cerner: true,
            miles: '3.17',
          },
        ],
      })
      .mockReturnValueOnce({
        status: 'success',
        data: [
          {
            id: '358',
            name: 'FacilityOne',
            city: 'Cheyenne',
            state: 'WY',
            cerner: true,
            miles: '3.17',
          },
          {
            id: '359',
            name: 'FacilityTwo',
            city: 'Cheyenne',
            state: 'WY',
            cerner: false,
            miles: '3.17',
          },
        ],
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

  describe('with all cerner facilities', () => {
    it('should show all facility names', () => {
      fireEvent.press(screen.getByRole('tab', { name: 'Your care team uses My VA Health' }))
      expect(screen.getByLabelText('Your care team uses My  V-A  Health')).toBeTruthy()
      expect(screen.getByText('Sending a message to a care team at these facilities:')).toBeTruthy()
      expect(screen.getByText('FacilityOne')).toBeTruthy()
      expect(screen.getByText('FacilityTwo')).toBeTruthy()
      expect(screen.getByLabelText("You'll need to use our My  V-A  Health portal to send your message")).toBeTruthy()
      expect(screen.getByText("You'll need to use our My VA Health portal to send your message")).toBeTruthy()
      fireEvent.press(screen.getByRole('link', { name: 'Go to My VA Health' }))
      expect(Alert.alert).toBeCalled()
    })
  })

  it('should only show cerner facilities, not other facilities and should call mockExternalLinkSpy when link is selected', () => {
    fireEvent.press(screen.getByRole('tab', { name: 'Some of your care team uses My VA Health' }))
    expect(screen.getByLabelText('Some of your care team uses My  V-A  Health')).toBeTruthy()
    expect(screen.getByText('Sending a message to a care team at these facilities:')).toBeTruthy()
    expect(screen.getByText('FacilityOne')).toBeTruthy()
    expect(screen.queryByText('FacilityTwo')).toBeFalsy()
    expect(screen.getByLabelText("You'll need to use our My  V-A  Health portal to send your message")).toBeTruthy()
    expect(screen.getByText("You'll need to use our My VA Health portal to send your message")).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: 'Go to My VA Health' }))
    expect(Alert.alert).toBeCalled()
  })
})
