import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import TakePhotos from './TakePhotos'

context('TakePhotos', () => {
  const request = {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
  }

  const initializeTestInstance = () => {
    const props = mockNavProps(undefined, { addListener: jest.fn(), setOptions: jest.fn() }, { params: { request } })
    render(<TakePhotos {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByRole('tab', { name: t('fileUpload.accessibilityAlert.title') })).toBeTruthy()
    expect(
      screen.getByRole('header', { name: t('fileUpload.uploadFileUsingCamera', { displayName: '' }) }),
    ).toBeTruthy()
    expect(screen.getByText(t('fileUpload.takePhotoEachPage'))).toBeTruthy()
    expect(
      screen.getByText(
        t('fileUpload.ifMoreThan10.1') + t('fileUpload.ifMoreThan10.2') + t('fileUpload.ifMoreThan10.3'),
      ),
    ).toBeTruthy()
    expect(screen.getByText(t('fileUpload.maxFileSize'))).toBeTruthy()
    expect(screen.getByText(t('fileUpload.50MB'))).toBeTruthy()
    expect(screen.getByText(t('fileUpload.acceptedFileTypes'))).toBeTruthy()
    expect(screen.getByText(t('fileUpload.acceptedFileTypeOptions'))).toBeTruthy()
    expect(screen.getByRole('button', { name: t('fileUpload.takeOrSelectPhotos') })).toBeTruthy()
  })
})
