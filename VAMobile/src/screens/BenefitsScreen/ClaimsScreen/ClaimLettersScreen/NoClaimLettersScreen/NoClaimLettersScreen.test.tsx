import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import NoClaimLettersScreen from 'screens/BenefitsScreen/ClaimsScreen/ClaimLettersScreen/NoClaimLettersScreen/NoClaimLettersScreen'
import { context, render } from 'testUtils'

context('NoClaimLettersScreen', () => {
  it('Renders NoClaimLettersScreen', () => {
    render(<NoClaimLettersScreen />)
    expect(screen.getByText(t('claimLetters.noClaimLetters'))).toBeTruthy()
    expect(screen.getByText(t('claimLetters.youDontHaveAnyClaimLetters'))).toBeTruthy()
  })
})
