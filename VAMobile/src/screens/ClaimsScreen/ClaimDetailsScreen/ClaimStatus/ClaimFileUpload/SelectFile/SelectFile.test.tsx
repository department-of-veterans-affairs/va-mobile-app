import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, mockNavProps, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import SelectFile from './SelectFile'
import {VAButton} from 'components'
import {launchImageLibrary} from 'react-native-image-picker'

let mockShowActionSheetWithOptions = jest.fn()
jest.mock('@expo/react-native-action-sheet', () => {
  let original = jest.requireActual('@expo/react-native-action-sheet')
  return {
    ...original,
    useActionSheet: () => { return { showActionSheetWithOptions: mockShowActionSheetWithOptions }}
  }
})

jest.mock('react-native-image-picker', () => {
  let original = jest.requireActual('react-native-image-picker')
  return {
    ...original,
    launchImageLibrary: jest.fn()
  }
})


context('SelectFile', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any

  let request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true
  }

  const initializeTestInstance = () => {
    props = mockNavProps(undefined, { setOptions: jest.fn() }, { params: { request } })

    act(() => {
      component = renderWithProviders(<SelectFile {...props}/>)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
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
        'File folder',
        'Cancel',
      ]);
    })
  })
})
