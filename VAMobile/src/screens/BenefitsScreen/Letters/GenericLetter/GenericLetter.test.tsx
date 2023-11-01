import 'react-native'
import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import { LetterTypeConstants, LetterTypes } from 'store/api/types'
import { initialLettersState, downloadLetter } from 'store/slices'
import GenericLetter from './GenericLetter'

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    downloadLetter: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('GenericLetter', () => {
  const initializeTestInstance = (downloading = false, letterType: LetterTypes = LetterTypeConstants.commissary, hasDownloadError = false) => {
    const props = mockNavProps(undefined, undefined, { params: { header: 'header', description: 'desc', letterType } })
    render(<GenericLetter {...props} />, {
      preloadedState: {
        letters: {
          ...initialLettersState,
          downloading: downloading,
          letterDownloadError: hasDownloadError ? new Error('error') : undefined,
        },
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByText('Review letters')).toBeTruthy()
    expect(screen.getByTestId('Letters: header-page')).toBeTruthy()
    expect(screen.getByText('Review letter')).toBeTruthy()
  })

  describe('when downloading is set to true', () => {
    it('should show loading screen', () => {
      initializeTestInstance(true)
      expect(screen.getByText('Loading your letter...')).toBeTruthy()
    })
  })

  describe('when an error occurs', () => {
    it('should render error component when there is a letter download error', () => {
      initializeTestInstance(false, undefined, true)
      expect(screen.getByText('Your letter could not be downloaded.')).toBeTruthy()
    })

    it('should not render error component when there is no letter download error', () => {
      initializeTestInstance(false, undefined, false)
      expect(screen.queryByText('Your letter could not be downloaded.')).toBeFalsy()
    })
  })

  describe('when view letter is pressed', () => {
    it('should call downloadLetter with the given letter type', () => {
      initializeTestInstance(false, LetterTypeConstants.minimumEssentialCoverage)
      fireEvent.press(screen.getByRole('button', { name: 'Review letter' }))
      expect(downloadLetter).toBeCalledWith(LetterTypeConstants.minimumEssentialCoverage)
    })
  })

  describe('when the letter type is service verification', () => {
    it('should display an alert box', () => {
      initializeTestInstance(false, LetterTypeConstants.serviceVerification)
      expect(screen.getByText('You can now use your Benefit Summary letter instead of this Service Verification letter.')).toBeTruthy()
    })
  })
})
