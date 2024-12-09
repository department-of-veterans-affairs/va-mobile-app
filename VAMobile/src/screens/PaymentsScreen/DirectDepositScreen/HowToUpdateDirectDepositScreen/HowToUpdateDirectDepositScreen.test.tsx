import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import HowToUpdateDirectDepositScreen from './HowToUpdateDirectDepositScreen'

context('HowToUpdateDirectDepositScreen', () => {
  beforeEach(() => {
    render(<HowToUpdateDirectDepositScreen {...mockNavProps()} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByLabelText(t('directDeposit.title'))).toBeTruthy()
    expect(
      screen.getByRole('heading', {
        name: t('howToUpdateDirectDeposit.alert.title'),
      }),
    ).toBeTruthy()
    expect(screen.getByText(t('howToUpdateDirectDeposit.alert.body.1'))).toBeTruthy()
    expect(screen.getByText(t('howToUpdateDirectDeposit.alert.body.2'))).toBeTruthy()
    expect(screen.getByRole('header', { name: t('howToUpdateDirectDeposit.card.title') })).toBeTruthy()
    expect(screen.getByText(t('howToUpdateDirectDeposit.card.callUs'))).toBeTruthy()
    expect(screen.getByRole('link', { name: '800-827-1000' })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
    fireEvent.press(screen.getByRole('link', { name: '800-827-1000' }))
    expect(Linking.openURL).toBeCalled()
  })
})
