import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, findByTypeWithText, mockNavProps, mockStore, render } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'

import UploadFile from './UploadFile'
import { claim as Claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import { InitialState } from 'store/slices'
import { TextView, VAButton, VAModalPicker, VASelector } from 'components'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { ImagePickerResponse } from 'react-native-image-picker'
import { RenderAPI } from '@testing-library/react-native'

const mockAlertSpy = jest.fn()
const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
    useDestructiveActionSheet: () => mockAlertSpy,
  }
})

context('UploadFile', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let navigateToSpy: jest.Mock

  let request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
  }

  const initializeTestInstance = (imageUploaded?: ImagePickerResponse) => {
    navigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(navigateToSpy)

    const file = {
      name: 'File 1',
      size: 100,
    } as DocumentPickerResponse

    props = mockNavProps(undefined, { addListener: jest.fn(), setOptions: jest.fn(), navigate: jest.fn() }, { params: { request, fileUploaded: file, imageUploaded } })

    component = render(<UploadFile {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          claim: Claim,
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

  describe('on click of the upload button', () => {
    it('should display an error if the checkbox is not checked', async () => {
      act(() => {
        testInstance.findByType(VAModalPicker).props.onSelectionChange('L228')
        testInstance.findAllByType(VAButton)[0].props.onPress()
      })

      expect(findByTypeWithText(testInstance, TextView, 'Check the box to confirm the information is correct')).toBeTruthy()
      expect(mockAlertSpy).not.toHaveBeenCalled()
    })

    it('should bring up confirmation requirements are met', async () => {
      act(() => {
        testInstance.findByType(VAModalPicker).props.onSelectionChange('L228')
        testInstance.findByType(VASelector).props.onSelectionChange(true)
        testInstance.findAllByType(VAButton)[0].props.onPress()
      })

      expect(mockAlertSpy).toHaveBeenCalled()
    })
  })
})
