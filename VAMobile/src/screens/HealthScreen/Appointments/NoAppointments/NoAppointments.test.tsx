import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'

import NoAppointments from './NoAppointments'

context('NoAppointments', () => {
  it('initializes correctly', () => {
    render(<NoAppointments subText="You don't have any appointments in this range" />)
    expect(screen.getByText(t('noAppointments.youDontHave'))).toBeTruthy()
    expect(screen.getByText("You don't have any appointments in this range")).toBeTruthy()
    expect(screen.getByText(t('noAppointments.visitVA'))).toBeTruthy()
  })
})
