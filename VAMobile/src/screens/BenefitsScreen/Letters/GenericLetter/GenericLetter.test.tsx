import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { LetterTypeConstants, LetterTypes } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'

import GenericLetter from './GenericLetter'

jest.mock('store/slices', () => {
  return {
    ...jest.requireActual<typeof import('store/slices')>('store/slices'),
    downloadLetter: jest.fn(() => ({ type: '', payload: '' })),
  }
})

context('GenericLetter', () => {
  const initializeTestInstance = (letterType: LetterTypes = LetterTypeConstants.commissary) => {
    const props = mockNavProps(undefined, undefined, { params: { header: 'header', description: 'desc', letterType } })
    render(<GenericLetter {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('button', { name: t('letters.benefitService.viewLetter') })).toBeTruthy()
  })

  describe('when the letter type is service verification', () => {
    it('should display an alert box', () => {
      initializeTestInstance(LetterTypeConstants.serviceVerification)
      expect(screen.getByText(t('letters.serviceVerificationLetter.informational'))).toBeTruthy()
    })
  })
})
