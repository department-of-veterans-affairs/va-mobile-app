import React from 'react'
import { Alert } from 'react-native'

import CernerAlertSM from 'screens/HealthScreen/SecureMessaging/CernerAlertSM/CernerAlertSM'
import { context, fireEvent, render, screen } from 'testUtils'

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

  it('should only show cerner facilities, not other facilities and should call mockExternalLinkSpy when link is selected', () => {
    fireEvent.press(screen.getByRole('tab', { name: 'Some of your care team uses My VA Health' }))
    expect(screen.getByLabelText('Some of your care team uses My  V-A  Health')).toBeTruthy()
    expect(
      screen.getByText("To manage your care at these facilities you'll need to use our My VA Health portal."),
    ).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: 'Go to My VA Health' }))
    expect(Alert.alert).toHaveBeenCalled()
  })
})
