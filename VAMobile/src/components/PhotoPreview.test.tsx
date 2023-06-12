import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock

import { context, render, RenderAPI } from 'testUtils'
import PhotoPreview from 'components/PhotoPreview'
import { Asset } from 'react-native-image-picker/src/types'

context('PhotoPreview', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock
  let image: Asset = {
    uri: 'testing',
    fileSize: 1234,
  }

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    component = render(<PhotoPreview width={110} height={110} image={image} onDeleteCallback={onPressSpy} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
