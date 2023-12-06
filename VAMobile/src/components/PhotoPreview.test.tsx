import React from 'react'
import Mock = jest.Mock
import { context, render, screen } from 'testUtils'
import PhotoPreview from 'components/PhotoPreview'
import { Asset } from 'react-native-image-picker/src/types'
import { bytesToFinalSizeDisplay } from 'utils/common'
import { t } from 'i18next'

context('PhotoPreview', () => {
  let onPressSpy: Mock
  let image: Asset = {
    uri: 'testing',
    fileSize: 1234,
  }

  beforeEach(() => {
    onPressSpy = jest.fn(() => { })

    render(<PhotoPreview width={110} height={110} image={image} onDeleteCallback={onPressSpy} />)
  })

  it('renders correctly', () => {
    expect(screen.getByAccessibilityHint('Remove this photo')).toBeTruthy()
    expect(screen.getByText(bytesToFinalSizeDisplay(1234, t, false))).toBeTruthy()
  })
})
