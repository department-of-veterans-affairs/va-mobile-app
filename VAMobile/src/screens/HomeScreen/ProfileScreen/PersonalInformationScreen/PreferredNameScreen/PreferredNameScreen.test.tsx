import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import PreferredNameScreen from './PreferredNameScreen'

context('PreferredNameScreen', () => {
  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    render(<PreferredNameScreen {...props} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: t('personalInformation.preferredName.title') })).toBeTruthy()
    expect(screen.getByText(t('personalInformation.preferredNameScreen.body'))).toBeTruthy()
    expect(screen.getByText(t('personalInformation.preferredName.editHelperText'))).toBeTruthy()
    expect(screen.getByTestId('preferredNameTestID')).toBeTruthy()
    expect(screen.getByRole('button', { name: t('save') })).toBeTruthy()
  })

  describe('when name has a number in it', () => {
    it('should show error text', () => {
      fireEvent.changeText(screen.getByTestId('preferredNameTestID'), 'Bobby3')
      fireEvent.press(screen.getByRole('button', { name: t('save') }))
      expect(screen.getByText(t('personalInformation.preferredName.lettersOnly'))).toBeTruthy()
    })
  })

  describe('when name has to many characters', () => {
    it('should show error text', () => {
      fireEvent.changeText(screen.getByTestId('preferredNameTestID'), 'abcdefghijklmnopqrstuvwxyz')
      fireEvent.press(screen.getByRole('button', { name: t('save') }))
      expect(screen.getByText(t('personalInformation.preferredName.tooManyCharacters'))).toBeTruthy()
    })
  })

  describe('when name ie empty', () => {
    it('should show error text', () => {
      fireEvent.press(screen.getByRole('button', { name: t('save') }))
      expect(screen.getByText(t('personalInformation.preferredName.fieldEmpty'))).toBeTruthy()
    })
  })
})
