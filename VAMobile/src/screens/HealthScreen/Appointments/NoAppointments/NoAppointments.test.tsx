import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import NoAppointments from 'screens/HealthScreen/Appointments/NoAppointments/NoAppointments'
import { context, render } from 'testUtils'

let mockUseDowntime: jest.Mock
jest.mock('utils/hooks', () => {
  mockUseDowntime = jest.fn(() => false)
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useDowntime: mockUseDowntime,
  }
})

context('NoAppointments', () => {
  it('initializes correctly', () => {
    render(<NoAppointments subText={t('noAppointments.youDontHaveForDates')} />)
    expect(screen.getByText(t('noAppointments.youDontHave'))).toBeTruthy()
    expect(screen.getByText(t('noAppointments.youDontHaveForDates'))).toBeTruthy()
    expect(screen.getByText(t('noAppointments.visitVA'))).toBeTruthy()
  })

  it('should show the maintenance message when in maintenance', () => {
    mockUseDowntime.mockImplementation(() => true)

    render(<NoAppointments subText={t('noAppointments.youDontHaveForDates')} />)
    expect(screen.getByText(t('contentUnavailable.maintenance'))).toBeTruthy()
  })
})
