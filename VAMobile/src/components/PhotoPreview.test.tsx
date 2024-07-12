import React from 'react'
import { Asset } from 'react-native-image-picker/src/types'

import { t } from 'i18next'

import PhotoPreview from 'components/PhotoPreview'
import { context, render, screen } from 'testUtils'
import { bytesToFinalSizeDisplay } from 'utils/common'

import Mock = jest.Mock

context('PhotoPreview', () => {
  let onPressSpy: Mock
  const image: Asset = {
    uri: 'testing',
    fileSize: 1234,
  }

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    render(<PhotoPreview width={110} height={110} image={image} onDeleteCallback={onPressSpy} />)
  })

  it('renders correctly', () => {
    expect(screen.getByAccessibilityHint('Remove this photo')).toBeTruthy()
    expect(screen.getByText(bytesToFinalSizeDisplay(1234, t, false))).toBeTruthy()
  })
})
