import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import IncorrectServiceInfo from './index'

context('IncorrectServiceInfo', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<IncorrectServiceInfo {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: t('militaryInformation.incorrectServiceInfo') })).toBeTruthy()
    expect(screen.getByText(t('militaryInformation.incorrectServiceInfo.body.1'))).toBeTruthy()
    expect(screen.getByText(t('militaryInformation.incorrectServiceInfo.body.2'))).toBeTruthy()
    expect(screen.getByText(t('militaryInformation.incorrectServiceInfo.body.3'))).toBeTruthy()
    expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8005389552')) })).toBeTruthy()
  })

  it('should call DMDC on press', () => {
    const i18nPhoneNumber = t('8005389552')
    fireEvent.press(screen.getByRole('link', { name: displayedTextPhoneNumber(i18nPhoneNumber) }))
    expect(Linking.openURL).toHaveBeenCalledWith(`tel:${i18nPhoneNumber}`)
  })
})
