import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import HowWillYouScreen from './HowWillYouScreen'

context('HowWillYouScreen', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<HowWillYouScreen {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText(t('contactInformation.howWillYouUseContactInfo'))).toBeTruthy()
    expect(screen.getByText(t('howWillYou.useInfo.1'))).toBeTruthy()
    expect(screen.getByText(t('howWillYou.useInfo.2'))).toBeTruthy()
  })
})
