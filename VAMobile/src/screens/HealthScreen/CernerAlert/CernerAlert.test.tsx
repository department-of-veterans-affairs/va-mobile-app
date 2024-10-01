import React from 'react'
import { Alert } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import CernerAlert from './CernerAlert'

jest.mock('../../../api/facilities/getFacilitiesInfo', () => {
  const original = jest.requireActual('../../../api/facilities/getFacilitiesInfo')
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

context('CernerAlert', () => {
  const initializeTestInstance = (): void => {
    render(<CernerAlert />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('When only cerner facilities', () => {
    fireEvent.press(screen.getByRole('tab', { name: 'Your care team uses My VA Health' }))
    expect(screen.getByLabelText('Your care team uses My  V-A  Health')).toBeTruthy()
    expect(
      screen.getByLabelText("You'll need to use our My  V-A  Health portal to manage your care at these facilities:"),
    ).toBeTruthy()
    expect(
      screen.getByText("You'll need to use our My VA Health portal to manage your care at these facilities:"),
    ).toBeTruthy()
    expect(screen.getByText('FacilityOne')).toBeTruthy()
    expect(screen.getByText('FacilityTwo')).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: 'Go to My VA Health' }))
    expect(Alert.alert).toBeCalled()
  })

  it('when some facilities are cerner and pressing the link', async () => {
    fireEvent.press(screen.getByRole('tab', { name: 'Some of your care team uses My VA Health' }))
    expect(screen.getByLabelText('Some of your care team uses My  V-A  Health')).toBeTruthy()
    expect(
      screen.getByLabelText("You'll need to use our My  V-A  Health portal to manage your care at these facilities:"),
    ).toBeTruthy()
    expect(
      screen.getByText("You'll need to use our My VA Health portal to manage your care at these facilities:"),
    ).toBeTruthy()
    expect(screen.getByText('FacilityOne')).toBeTruthy()
    expect(
      screen.getByLabelText('You can still use this app to manage your care at other  V-A  health facilities.'),
    ).toBeTruthy()
    expect(
      screen.getByText('You can still use this app to manage your care at other VA health facilities.'),
    ).toBeTruthy()
    fireEvent.press(screen.getByLabelText('Go to My V-A Health'))
    expect(Alert.alert).toBeCalled()
  })
})
