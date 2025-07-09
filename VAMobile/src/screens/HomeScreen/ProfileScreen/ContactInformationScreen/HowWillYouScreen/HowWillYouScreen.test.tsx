import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import HowWillYouScreen from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/HowWillYouScreen/HowWillYouScreen'
import { context, mockNavProps, render } from 'testUtils'

context('HowWillYouScreen', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<HowWillYouScreen {...props} />)
    jest.advanceTimersByTime(50)
  })

  it('initializes correctly', () => {
    expect(screen.getByText(t('contactInformation.howWillYouUseContactInfo'))).toBeTruthy()
    expect(screen.getByText(t('howWillYou.useInfo.1'))).toBeTruthy()
    expect(screen.getByText(t('howWillYou.useInfo.2'))).toBeTruthy()
  })
})
