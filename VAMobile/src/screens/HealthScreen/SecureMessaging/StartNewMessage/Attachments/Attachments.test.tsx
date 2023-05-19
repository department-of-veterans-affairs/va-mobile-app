import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import DocumentPicker from 'react-native-document-picker'
import { ImagePickerResponse } from 'react-native-image-picker'

import { context, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import Attachments from './Attachments'
import { AlertBox, TextView, VAButton } from 'components'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { when } from 'jest-when'

let mockShowActionSheetWithOptions = jest.fn()
jest.mock('@expo/react-native-action-sheet', () => {
  let original = jest.requireActual('@expo/react-native-action-sheet')
  return {
    ...original,
    useActionSheet: () => {
      return { showActionSheetWithOptions: mockShowActionSheetWithOptions }
    },
  }
})

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  let theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('Attachments', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let goBack: jest.Mock
  let mockNavigateToEditDraftSpy: jest.Mock

  const initializeTestInstance = (attachmentsList: Array<ImagePickerResponse | DocumentPickerResponse> = []) => {
    goBack = jest.fn()
    mockNavigateToEditDraftSpy = jest.fn()

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('EditDraft', { attachmentFileToAdd: { name: 'custom-file-name.docx', type: 'docx', uri: 'uri' }, attachmentFileToRemove: {}, messageID: undefined })
      .mockReturnValue(mockNavigateToEditDraftSpy)

    props = mockNavProps(undefined, { setOptions: jest.fn(), goBack }, { params: { attachmentsList } })

    component = render(<Attachments {...props} />)

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('on click of select a file', () => {
    it('should call showActionSheetWithOptions and display the action sheet', async () => {
      await waitFor(() => {
        testInstance.findByType(VAButton).props.onPress()

        expect(mockShowActionSheetWithOptions).toHaveBeenCalled()

        const actionSheetConfig = mockShowActionSheetWithOptions.mock.calls[0][0]
        expect(actionSheetConfig.options).toEqual(['Camera', 'Photo Gallery', 'File Folder', 'Cancel'])
      })
    })
  })
})
