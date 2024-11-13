import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import ContactVAScreen from './ContactVAScreen'

context('ContactVAScreen', () => {
  beforeEach(() => {
    const props = mockNavProps(
      {},
      {
        setOptions: () => {},
      },
    )
    render(<ContactVAScreen {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('link', { name: t('crisisLineButton.label') })).toBeTruthy()
    expect(screen.getByRole('header', { name: t('contactVA.va411.callMy') })).toBeTruthy()
    expect(screen.getByText(t('contactVA.va411.body'))).toBeTruthy()
    expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8006982411')) })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
  })
})
