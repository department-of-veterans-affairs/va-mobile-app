import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import PrepareForVideoVisit from './PrepareForVideoVisit'

context('PrepareForVideoVisit', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn() })
    render(<PrepareForVideoVisit {...props} />)
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
