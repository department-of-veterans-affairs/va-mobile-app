import React from 'react'

import { screen } from '@testing-library/react-native'

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
    expect(screen.getByText('Review letters')).toBeTruthy()
    expect(screen.getByTestId('Letters: header-page')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Review letter' })).toBeTruthy()
  })

  describe('when the letter type is service verification', () => {
    it('should display an alert box', () => {
      initializeTestInstance(LetterTypeConstants.serviceVerification)
      expect(
        screen.getByText('You can now use your Benefit Summary letter instead of this Service Verification letter.'),
      ).toBeTruthy()
    })
  })
})
