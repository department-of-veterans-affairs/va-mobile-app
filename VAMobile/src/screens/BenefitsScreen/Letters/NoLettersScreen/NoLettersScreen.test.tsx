import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import NoLettersScreen from './NoLettersScreen'

context('NoLettersScreen', () => {
  it('initializes correctly', () => {
    render(<NoLettersScreen />)
    expect(screen.getByRole('header', { name: t('noLetters.header') })).toBeTruthy()
    expect(screen.getByText(t('noLetters.ifYouThink'))).toBeTruthy()
    expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8008271000')) })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
  })
})
