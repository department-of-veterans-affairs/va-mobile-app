import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { Pressable } from 'react-native'

import { context, mockNavProps, mockStore, render, RenderAPI } from 'testUtils'
import { LetterTypeConstants, LetterTypes } from 'store/api/types'
import { initialLettersState, InitialState, downloadLetter } from 'store/slices'
import { AlertBox, BasicError, LoadingComponent } from 'components'
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
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any

  const initializeTestInstance = (downloading = false, letterType: LetterTypes = LetterTypeConstants.commissary, hasDownloadError = false) => {
    props = mockNavProps(undefined, undefined, { params: { header: 'header', description: 'desc', letterType } })

    component = render(<GenericLetter {...props} />, {
      preloadedState: {
        ...InitialState,
        letters: {
          ...initialLettersState,
          downloading: downloading,
          letterDownloadError: hasDownloadError ? new Error('error') : undefined,
        },
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when downloading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when an error occurs', () => {
    it('should render error component when there is a letter download error', async () => {
      initializeTestInstance(false, undefined, true)
      expect(testInstance.findAllByType(BasicError)).toHaveLength(1)
    })

    it('should not render error component when there is no letter download error', async () => {
      initializeTestInstance(false, undefined, false)
      expect(testInstance.findAllByType(BasicError)).toHaveLength(0)
    })
  })

  describe('when view letter is pressed', () => {
    it('should call downloadLetter with the given letter type', async () => {
      initializeTestInstance(false, LetterTypeConstants.minimumEssentialCoverage)
      testInstance.findByType(Pressable).props.onPress()
      expect(downloadLetter).toBeCalledWith(LetterTypeConstants.minimumEssentialCoverage)
    })
  })

  describe('when the letter type is service verification', () => {
    it('should display an alert box', async () => {
      initializeTestInstance(false, LetterTypeConstants.serviceVerification)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
    })
  })
})
