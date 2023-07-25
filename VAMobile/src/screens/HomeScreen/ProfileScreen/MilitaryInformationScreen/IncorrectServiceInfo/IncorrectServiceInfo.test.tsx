import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, findByTestID, mockNavProps, render, RenderAPI } from 'testUtils'

import { Linking } from 'react-native'
import IncorrectServiceInfo from './index'

context('IncorrectServiceInfo', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn() })
    component = render(<IncorrectServiceInfo {...props} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call DMDC on press', async () => {
    testInstance.findByProps({ accessibilityLabel: '8 0 0 5 3 8 9 5 5 2' }).props.onPress()
    expect(Linking.openURL).toHaveBeenCalledWith('tel:8005389552')
  })
})
