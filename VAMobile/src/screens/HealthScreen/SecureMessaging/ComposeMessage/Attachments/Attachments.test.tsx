import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, renderWithProviders} from 'testUtils'
import Attachments from './Attachments'
import {VAButton} from 'components'

let mockShowActionSheetWithOptions = jest.fn()
jest.mock('@expo/react-native-action-sheet', () => {
  let original = jest.requireActual('@expo/react-native-action-sheet')
  return {
    ...original,
    useActionSheet: () => { return { showActionSheetWithOptions: mockShowActionSheetWithOptions }}
  }
})

context('Attachments', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any

  beforeEach(() => {
    props = mockNavProps(undefined, { setOptions: jest.fn() })

    act(() => {
      component = renderWithProviders(<Attachments {...props}/>)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of select a file', () => {
    it('should call showActionSheetWithOptions and display the action sheet', async () => {
      testInstance.findByType(VAButton).props.onPress()

      expect(mockShowActionSheetWithOptions).toHaveBeenCalled()

      const actionSheetConfig = mockShowActionSheetWithOptions.mock.calls[0][0];
      expect(actionSheetConfig.options).toEqual([
        'Camera',
        'Photo gallery',
        'File folder',
        'Cancel',
      ]);
    })
  })
})
