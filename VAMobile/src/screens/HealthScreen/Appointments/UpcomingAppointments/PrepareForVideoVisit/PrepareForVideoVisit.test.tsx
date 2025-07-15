import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import PrepareForVideoVisit from 'screens/HealthScreen/Appointments/UpcomingAppointments/PrepareForVideoVisit/PrepareForVideoVisit'
import { context, mockNavProps, render } from 'testUtils'

context('PrepareForVideoVisit', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn() })
    render(<PrepareForVideoVisit {...props} />)
    jest.advanceTimersByTime(50)
  })

  it('initializes correctly', () => {
    expect(screen.getByText(t('appointmentsTab.medicationWording.howToSetUpDevice'))).toBeTruthy()
    expect(screen.getByText(t('prepareForVideoVisit.beforeYourAppointment'))).toBeTruthy()
    expect(screen.getByText(t('prepareForVideoVisit.downloadBasedOnDevice'))).toBeTruthy()
    expect(screen.getByText(t('prepareForVideoVisit.cameraAndMicrophone'))).toBeTruthy()
    expect(screen.getByText(t('prepareForVideoVisit.joinBy'))).toBeTruthy()
    expect(screen.getByText(t('prepareForVideoVisit.toHaveBestExperience'))).toBeTruthy()
    expect(screen.getByText(t('prepareForVideoVisit.connectFromQuietPlace'))).toBeTruthy()
    expect(screen.getByText(t('prepareForVideoVisit.checkConnection'))).toBeTruthy()
    expect(screen.getByText(t('prepareForVideoVisit.connectWithWifi'))).toBeTruthy()
  })
})
