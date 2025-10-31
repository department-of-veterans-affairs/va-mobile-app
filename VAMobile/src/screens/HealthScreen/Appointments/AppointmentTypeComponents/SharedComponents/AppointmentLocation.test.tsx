import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { AppointmentAttributes } from 'api/types'
import AppointmentLocation from 'screens/HealthScreen/Appointments/AppointmentTypeComponents/SharedComponents/AppointmentLocation'
import { render } from 'testUtils'
import { AppointmentDetailsSubTypeConstants, AppointmentDetailsTypeConstants } from 'utils/appointments'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'

describe('AppointmentLocation', () => {
  const initializeTestInstance = (isCerner: boolean) => {
    const attributes: AppointmentAttributes = { ...defaultAppointmentAttributes, isCerner }
    render(
      <AppointmentLocation
        attributes={attributes}
        subType={AppointmentDetailsSubTypeConstants.Upcoming}
        type={AppointmentDetailsTypeConstants.InPersonVA}
      />,
    )
  }

  it('should render Not Available for Clinic and Location for non-Cerner appointments when missing', () => {
    initializeTestInstance(false)
    expect(screen.getByTestId('appointmentsClinicId')).toBeTruthy()
    expect(screen.getByText(t('appointments.clinic', { clinicName: t('appointments.notAvailable') }))).toBeTruthy()
    expect(screen.getByTestId('appointmentsPhysicalLocationId')).toBeTruthy()
    expect(
      screen.getByText(t('appointments.physicalLocation', { physicalLocation: t('appointments.notAvailable') })),
    ).toBeTruthy()
  })

  it('should not render Clinic and Location for Cerner appointments', () => {
    initializeTestInstance(true)
    expect(screen.queryByTestId('appointmentsClinicId')).toBeNull()
    expect(screen.queryByTestId('appointmentsPhysicalLocationId')).toBeNull()
  })
})
