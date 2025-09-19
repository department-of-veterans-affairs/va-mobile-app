import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import ContactVAScreen from 'screens/HomeScreen/ContactVAScreen/ContactVAScreen'
import { context, mockNavProps, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

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
    expect(screen.getByRole('header', { name: t('contactVA.va411.callUs') })).toBeTruthy()
    expect(screen.getByText(t('contactVA.va411.body'))).toBeTruthy()
    expect(screen.getByRole('header', { name: t('contactVA.va411.mainInfo') })).toBeTruthy()
    expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8006982411')) })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
    expect(screen.getByRole('header', { name: t('contactVA.va411.techSupport') })).toBeTruthy()
    expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8662793677')) })).toBeTruthy()
  })
})
