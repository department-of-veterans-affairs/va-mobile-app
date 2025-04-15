import React from 'react'

import { t } from 'i18next'
import { DateTime } from 'luxon'

import { context, mockNavProps, render, screen } from 'testUtils'

import SubmitSuccessScreen from './SubmitSuccessScreen'

const params = {
  facilityName: 'Test Facility',
  appointmentDateTime: '2021-01-01T00:00:00Z',
  loading: false,
}

context('SubmitSuccessScreen', () => {
  const initializeTestInstance = (loading: boolean = false) => {
    const props = mockNavProps(undefined, undefined, { params: { ...params, loading } })
    render(<SubmitSuccessScreen {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText(t('travelPay.success.title'))).toBeTruthy()
    expect(
      screen.getByText(
        t('travelPay.success.text', {
          facilityName: params.facilityName,
          date: DateTime.fromISO(params.appointmentDateTime).toFormat('LLLL dd, yyyy'),
          time: DateTime.fromISO(params.appointmentDateTime).toFormat('h:mm a'),
        }),
      ),
    ).toBeTruthy()
    expect(screen.getByText(t('travelPay.success.nextTitle'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.success.nextText'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.success.nextText2'))).toBeTruthy()
    expect(screen.getByTestId('goToAppointmentLinkID')).toBeTruthy()
    expect(screen.getByTestId('setUpDirectDepositLinkID')).toBeTruthy()
  })

  it('should show the loading screen when the loading prop is true', () => {
    initializeTestInstance(true)
    expect(screen.getByText(t('travelPay.submitLoading'))).toBeTruthy()
  })
})
