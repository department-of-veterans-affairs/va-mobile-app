import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { AppointmentAttributes } from 'api/types'
import AppointmentAfterVisitError from 'screens/HealthScreen/Appointments/AppointmentTypeComponents/SharedComponents/AppointmentAfterVisitError'
import { render } from 'testUtils'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'

describe('AppointmentLocation', () => {
  const initializeTestInstance = (isCerner: boolean, id: string, avsError: string = '') => {
    const attributes: AppointmentAttributes = {
      ...defaultAppointmentAttributes,
      isCerner,
      avsError: avsError,
      avsPdf: [
        {
          apptId: 'test',
          id: '1',
          name: 'Test',
          loincCodes: [],
          noteType: 'afterVisitSummary',
          contentType: 'application/pdf',
          binary: 'c29tZSBzdHJpbmcK',
        },
      ],
    }
    render(<AppointmentAfterVisitError attributes={attributes} />)
  }

  it('should not show error for VistA appointments', () => {
    initializeTestInstance(false, 'testvista001', 'some error')
    expect(screen.queryByTestId('avs-error-alert')).toBeNull()
  })

  it('should show error', () => {
    initializeTestInstance(true, 'testcerner005', 'some error')
    expect(screen.queryByText(t('appointments.afterVisitSummary.error.header'))).not.toBeNull()
  })
})
