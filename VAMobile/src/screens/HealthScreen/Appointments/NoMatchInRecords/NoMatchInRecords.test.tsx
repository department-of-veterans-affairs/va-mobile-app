import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import NoMatchInRecords from 'screens/HealthScreen/Appointments/NoMatchInRecords/NoMatchInRecords'
import { context, render } from 'testUtils'

context('NoMatchInRecords', () => {
  it('initializes correctly', () => {
    render(<NoMatchInRecords />)
    expect(screen.getByText(t('noMatch.title'))).toBeTruthy()
    expect(screen.getByText(t('noMatch.noMatch'))).toBeTruthy()
    expect(screen.getByText(t('noMatch.whatYouCanDo'))).toBeTruthy()
    expect(screen.getByText(t('noMatch.currentlyRegisteredPatient'))).toBeTruthy()
    expect(screen.getByText(t('noMatch.enrolledInHealthCare'))).toBeTruthy()
    expect(screen.getByText(t('noMatch.notEnrolled'))).toBeTruthy()
  })
})
