import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import NoClaimsAndAppealsAccess from 'screens/BenefitsScreen/ClaimsScreen/NoClaimsAndAppealsAccess/NoClaimsAndAppealsAccess'
import { context, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

context('NoClaimsAndAppealsAccess', () => {
  beforeEach(() => {
    render(<NoClaimsAndAppealsAccess />)
  })

  it('Renders NoClaimsAndAppealsAccess', () => {
    expect(screen.getByText(t('claimsAndAppeals.noClaimsAndAppealsAccess.title'))).toBeTruthy()
    expect(screen.getByText(t('claimsAndAppeals.noClaimsAndAppealsAccess.body'))).toBeTruthy()
    expect(screen.getByRole('link', { name: displayedTextPhoneNumber('8008271000') })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
  })
})
