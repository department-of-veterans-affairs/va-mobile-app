import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'

import NoAppointments from './NoAppointments'

context('NoAppointments', () => {
  it('initializes correctly', () => {
    render(<NoAppointments subText={t('noAppointments.youDontHaveForDates')} />)
    expect(screen.getByText(t('noAppointments.youDontHave'))).toBeTruthy()
    expect(screen.getByText(t('noAppointments.youDontHaveForDates'))).toBeTruthy()
    expect(screen.getByText(t('noAppointments.visitVA'))).toBeTruthy()
  })
})
