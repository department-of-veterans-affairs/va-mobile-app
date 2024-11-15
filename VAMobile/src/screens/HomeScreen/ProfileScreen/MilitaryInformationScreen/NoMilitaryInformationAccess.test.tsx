import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'

import NoMilitaryInformationAccess from './NoMilitaryInformationAccess'

context('NoMilitaryInformationAccess', () => {
  it('should render text fields correctly', () => {
    render(<NoMilitaryInformationAccess />)
    expect(screen.getByRole('header', { name: t('militaryInformation.noMilitaryInfoAccess.title') })).toBeTruthy()
    expect(screen.getByText(t('militaryInformation.noMilitaryInfoAccess.body'))).toBeTruthy()
  })
})
